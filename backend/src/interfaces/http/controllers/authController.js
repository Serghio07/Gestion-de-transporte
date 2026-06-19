const UAParser = require('ua-parser-js');
const { randomInt, randomUUID } = require('crypto');
const { sequelize, Empresa, Session, TelefonoVerificacion, Usuario } = require('../../../infrastructure/persistence');

function getContainer() {
  return require('../../../container');
}

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.startsWith('591') && digits.length > 8 ? digits.slice(3) : digits;
}

class AuthController {
  /**
   * Parsea el User-Agent para obtener nombre del dispositivo
   */
  _parseDeviceName(userAgent) {
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    const browser = result.browser.name || 'Browser';
    const os = result.os.name || 'OS';
    return `${browser} on ${os}`;
  }

  _getClientIp(req) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      return forwardedFor.split(',')[0].trim();
    }
    return req.ip || req.socket?.remoteAddress || null;
  }

  _getRefreshExpiry(authService) {
    const refreshExpiry = process.env.JWT_REFRESH_EXPIRATION || '7d';
    return new Date(Date.now() + authService.parseExpiry(refreshExpiry));
  }

  async _deactivateSession(sessionId, usuarioId) {
    if (!sessionId || !usuarioId) return;
    await Session.update(
      { activa: false, ultimo_acceso: new Date() },
      { where: { token_jti: sessionId, usuario_id: usuarioId } }
    );
  }

  _generateVerificationCode() {
    return String(randomInt(100000, 1000000));
  }

  async _sendVerificationCode(usuario, transaction = null) {
    const authService = getContainer().get('authService');
    const whatsappService = getContainer().get('whatsappService');
    const code = this._generateVerificationCode();
    const ttlMinutes = parseInt(process.env.PHONE_VERIFICATION_TTL_MINUTES || '10', 10);
    const expiraEn = new Date(Date.now() + ttlMinutes * 60 * 1000);

    await TelefonoVerificacion.update(
      { consumido: true },
      {
        where: { usuario_id: usuario.id, consumido: false },
        transaction
      }
    );

    await TelefonoVerificacion.create({
      usuario_id: usuario.id,
      telefono: usuario.telefono,
      codigo_hash: await authService.hashPassword(code),
      expira_en: expiraEn
    }, { transaction });

    await whatsappService.send(
      usuario.telefono,
      `Tu codigo de confirmacion de TranspoSystem es ${code}. Expira en ${ttlMinutes} minutos.`
    );

    return {
      expiresAt: expiraEn,
      devCode: process.env.NODE_ENV === 'production' ? undefined : code
    };
  }

  /**
   * POST /api/auth/register
   * Registro público SOLO para el primer admin (setup inicial)
   * Si ya existen usuarios, retorna error 403
   */
  async register(req, res, next) {
    try {
      const { nombre, email, password } = req.body;

      if (!nombre || !email || !password) {
        return res.status(422).json({
          success: false,
          error: 'Nombre, email y contraseña son requeridos',
          code: 'VALIDATION_ERROR'
        });
      }

      const usuarioRepository = getContainer().get('usuarioRepository');
      
      // Verificar que NO existan usuarios (primer registro)
      const existingUsers = await usuarioRepository.findAll();
      if (existingUsers && existingUsers.data && existingUsers.data.length > 0) {
        return res.status(403).json({
          success: false,
          error: 'El sistema ya tiene usuarios registrados. Solo un administrador puede crear nuevos usuarios.',
          code: 'REGISTRATION_CLOSED'
        });
      }

      const authService = getContainer().get('authService');
      
      // Verificar email único
      const existingEmail = await usuarioRepository.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: 'El email ya está registrado',
          code: 'EMAIL_EXISTS'
        });
      }

      // Crear primer admin (rol_id: 1)
      const hashedPassword = await authService.hashPassword(password);
      const usuario = await usuarioRepository.create({
        nombre,
        email,
        password_hash: hashedPassword,
        rol_id: 1, // Admin
        activo: true
      });

      res.status(201).json({
        success: true,
        message: 'Administrador registrado exitosamente. Ahora puedes iniciar sesión.',
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol_id: usuario.rol_id
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async registerWithEmpresa(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const telefono = normalizePhone(req.body.telefono || req.body.phone);
      const { password, confirmPassword } = req.body;
      const nombre = String(req.body.nombre || '').trim();
      const apellido = req.body.apellido ? String(req.body.apellido).trim() : null;
      const empresaTransporte = String(
        req.body.empresaTransporte ||
        req.body.empresa_transporte ||
        req.body.empresa ||
        ''
      ).trim().replace(/\s+/g, ' ');

      if (!nombre || !apellido || !empresaTransporte || !telefono || !password) {
        await transaction.rollback();
        return res.status(422).json({
          success: false,
          error: 'Nombre, apellido, empresa, telefono y contrasena son requeridos',
          code: 'VALIDATION_ERROR'
        });
      }

      if (confirmPassword && password !== confirmPassword) {
        await transaction.rollback();
        return res.status(422).json({
          success: false,
          error: 'Las contrasenas no coinciden',
          code: 'PASSWORD_MISMATCH'
        });
      }

      if (password.length < 8) {
        await transaction.rollback();
        return res.status(422).json({
          success: false,
          error: 'La contrasena debe tener al menos 8 caracteres',
          code: 'VALIDATION_ERROR'
        });
      }

      const existingTelefono = await Usuario.findOne({
        where: { telefono },
        transaction
      });

      if (existingTelefono) {
        await transaction.rollback();
        return res.status(409).json({
          success: false,
          error: 'El telefono ya esta registrado',
          code: 'PHONE_EXISTS'
        });
      }

      const authService = getContainer().get('authService');
      const hashedPassword = await authService.hashPassword(password);
      const [empresa] = await Empresa.findOrCreate({
        where: { nombre: empresaTransporte },
        defaults: { nombre: empresaTransporte },
        transaction
      });
      const usuario = await Usuario.create({
        nombre,
        apellido,
        empresa_transporte: empresaTransporte,
        empresa_id: empresa.id,
        email: null,
        telefono,
        password_hash: hashedPassword,
        rol_id: 2,
        activo: false,
        telefono_verificado_en: null
      }, { transaction });

      const verification = await this._sendVerificationCode(usuario, transaction);
      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Cuenta creada. Se envio un codigo de verificacion por WhatsApp.',
        requiresVerification: true,
        telefono: usuario.telefono,
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          empresaTransporte: usuario.empresa_transporte,
          telefono: usuario.telefono,
          rol_id: usuario.rol_id,
          activo: usuario.activo,
          telefono_verificado_en: usuario.telefono_verificado_en,
          verification
        }
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  async verifyPhone(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const telefono = normalizePhone(req.body.telefono || req.body.phone);
      const codigo = String(req.body.codigo || req.body.code || '').trim();

      if (!telefono || !codigo) {
        await transaction.rollback();
        return res.status(422).json({
          success: false,
          error: 'Telefono y codigo son requeridos',
          code: 'VALIDATION_ERROR'
        });
      }

      const usuario = await Usuario.findOne({ where: { telefono }, transaction });
      if (!usuario) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      if (usuario.telefono_verificado_en && usuario.activo) {
        await transaction.rollback();
        return res.status(409).json({
          success: false,
          error: 'La cuenta ya esta verificada',
          code: 'PHONE_ALREADY_VERIFIED'
        });
      }

      const verification = await TelefonoVerificacion.findOne({
        where: {
          usuario_id: usuario.id,
          telefono,
          consumido: false
        },
        order: [['creado_en', 'DESC']],
        transaction
      });

      if (!verification || new Date(verification.expira_en) < new Date()) {
        if (verification) {
          await verification.update({ consumido: true }, { transaction });
        }
        await transaction.commit();
        return res.status(410).json({
          success: false,
          error: 'El codigo expiro. Solicita uno nuevo.',
          code: 'CODE_EXPIRED'
        });
      }

      const authService = getContainer().get('authService');
      const validCode = await authService.comparePassword(codigo, verification.codigo_hash);
      if (!validCode) {
        await verification.increment('intentos', { by: 1, transaction });
        await transaction.commit();
        return res.status(401).json({
          success: false,
          error: 'Codigo incorrecto',
          code: 'INVALID_CODE'
        });
      }

      await verification.update({ consumido: true }, { transaction });
      await usuario.update({
        telefono_verificado_en: new Date(),
        activo: true
      }, { transaction });
      await transaction.commit();

      return res.json({
        success: true,
        message: 'Cuenta verificada correctamente',
        data: {
          id: usuario.id,
          telefono: usuario.telefono,
          activo: true
        }
      });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  }

  async resendPhoneCode(req, res, next) {
    try {
      const telefono = normalizePhone(req.body.telefono || req.body.phone);

      if (!telefono) {
        return res.status(422).json({
          success: false,
          error: 'Telefono requerido',
          code: 'VALIDATION_ERROR'
        });
      }

      const usuario = await Usuario.findOne({ where: { telefono } });
      if (!usuario) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      if (usuario.telefono_verificado_en && usuario.activo) {
        return res.status(409).json({
          success: false,
          error: 'La cuenta ya esta verificada',
          code: 'PHONE_ALREADY_VERIFIED'
        });
      }

      const verification = await this._sendVerificationCode(usuario);

      return res.json({
        success: true,
        message: 'Codigo reenviado por WhatsApp',
        data: {
          telefono: usuario.telefono,
          verification
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Autentica usuario y devuelve access token + refresh token en cookie
   * Crea una nueva sesión
   */
  async login(req, res, next) {
    try {
      const telefono = normalizePhone(req.body.telefono || req.body.phone);
      const { password } = req.body;

      if (!telefono || !password) {
        return res.status(422).json({
          success: false,
          error: 'Telefono y contrasena son requeridos',
          code: 'VALIDATION_ERROR'
        });
      }

      const authService = getContainer().get('authService');
      const usuario = await Usuario.findOne({
        where: { telefono },
        include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nombre'] }]
      });

      if (!usuario) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
          code: 'INVALID_CREDENTIALS'
        });
      }

      const isValidPassword = await authService.comparePassword(password, usuario.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas',
          code: 'INVALID_CREDENTIALS'
        });
      }

      if (!usuario.activo || !usuario.telefono_verificado_en) {
        return res.status(403).json({
          success: false,
          error: 'Debes confirmar tu telefono antes de iniciar sesion',
          code: 'PHONE_NOT_VERIFIED'
        });
      }

      if (!usuario.empresa_id && usuario.empresa_transporte) {
        const [empresa] = await Empresa.findOrCreate({
          where: { nombre: usuario.empresa_transporte },
          defaults: { nombre: usuario.empresa_transporte }
        });
        await usuario.update({ empresa_id: empresa.id });
      }

      const sessionId = randomUUID();
      const { accessToken, refreshToken, expiresIn } = authService.generateTokens(usuario, sessionId);
      const expiraEn = this._getRefreshExpiry(authService);

      await Session.create({
        usuario_id: usuario.id,
        token_jti: sessionId,
        device_info: this._parseDeviceName(req.headers['user-agent'] || ''),
        ip_address: this._getClientIp(req),
        expira_en: expiraEn,
        activa: true
      });

      await usuario.update({
        token_sesion_activo: sessionId,
        ultimo_acceso: new Date(),
        ultimo_login: new Date(),
        intentos_fallidos: 0,
        bloqueado_hasta: null
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth'
      });

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: usuario.id,
            name: usuario.nombre,
            telefono: usuario.telefono,
            empresa: usuario.empresa?.nombre || usuario.empresa_transporte || 'Sin empresa asignada',
            foto_url: usuario.foto_url || null,
            role: usuario.rol_id,
            permissions: usuario.permissions || []
          },
          accessToken: accessToken,
          expiresIn: expiresIn,
          sessionId: sessionId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Renueva el access token usando el refresh token de la cookie (Token Rotation)
   */
  async refresh(req, res, next) {
    try {
      const authService = getContainer().get('authService');
      const usuarioRepository = getContainer().get('usuarioRepository');

      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token requerido',
          code: 'MISSING_REFRESH_TOKEN'
        });
      }

      const decoded = await authService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token inválido o expirado',
          code: 'INVALID_REFRESH_TOKEN'
        });
      }

      const usuario = await usuarioRepository.findById(decoded.id);
      if (!usuario) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado',
          code: 'USER_NOT_FOUND'
        });
      }

      const sessionId = decoded.sid || null;
      const { accessToken, refreshToken: newRefreshToken, expiresIn } = await authService.rotateTokens(refreshToken, usuario, sessionId);

      if (sessionId) {
        await Session.update(
          {
            ultimo_acceso: new Date(),
            expira_en: this._getRefreshExpiry(authService),
            activa: true
          },
          { where: { token_jti: sessionId, usuario_id: usuario.id } }
        );
      }

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/api/auth'
      });

      res.json({
        success: true,
        message: 'Token renovado exitosamente',
        data: {
          accessToken: accessToken,
          expiresIn: expiresIn
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Cierra sesión e invalida tokens mediante blacklist
   */
  async logout(req, res, next) {
    try {
      const authService = getContainer().get('authService');
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado',
          code: 'UNAUTHORIZED'
        });
      }

      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        // Agregar a blacklist
        await authService.blacklistToken(refreshToken, 7 * 24 * 60 * 60, userId);
      }

      await this._deactivateSession(req.user?.sid, userId);

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/api/auth'
      });

      res.json({
        success: true,
        message: 'Logout exitoso - sesión invalidada'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/sessions
   * Lista todas las sesiones activas del usuario
   */
  async getSessions(req, res, next) {
    try {
      const sesiones = await Session.findAll({
        where: {
          usuario_id: req.user.id,
          activa: true
        },
        attributes: ['id', 'token_jti', 'device_info', 'ip_address', 'ultimo_acceso', 'expira_en', 'creado_en'],
        order: [['ultimo_acceso', 'DESC']]
      });

      return res.json({
        success: true,
        data: sesiones,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.user.id, {
        include: [{ model: Empresa, as: 'empresa', attributes: ['id', 'nombre'] }]
      });
      if (!usuario) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

      if (!usuario.empresa_id && usuario.empresa_transporte) {
        const [empresa] = await Empresa.findOrCreate({
          where: { nombre: usuario.empresa_transporte },
          defaults: { nombre: usuario.empresa_transporte }
        });
        await usuario.update({ empresa_id: empresa.id });
      }

      return res.json({
        success: true,
        data: {
          id: usuario.id,
          name: usuario.nombre,
          telefono: usuario.telefono,
          empresa: usuario.empresa?.nombre || usuario.empresa_transporte || 'Sin empresa asignada',
          foto_url: usuario.foto_url || null,
          role: usuario.rol_id,
          permissions: usuario.permissions || []
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/auth/sessions/:sessionId
   * Cierra una sesión específica (logout remoto)
   */
  async revokeSession(req, res, next) {
    try {
      const [updated] = await Session.update(
        { activa: false, ultimo_acceso: new Date() },
        {
          where: {
            id: req.params.sessionId,
            usuario_id: req.user.id
          }
        }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Sesion no encontrada' },
          timestamp: new Date().toISOString()
        });
      }

      return res.json({
        success: true,
        message: 'Sesion revocada',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
