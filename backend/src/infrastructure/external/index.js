// Infrastructure - External services (Auth, Email, Cache)

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UnauthorizedException, ValidationException } = require('../../domain/exceptions');

class AuthService {
  constructor(tokenBlacklistModel = null) {
    this.tokenBlacklistModel = tokenBlacklistModel;
    // Mantener Map en memoria como fallback si no hay model (para testing)
    this.tokenBlacklistMemory = new Map();
  }

  async hashPassword(password) {
    if (!password) {
      throw new ValidationException('Password is required');
    }
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password, hash) {
    if (!password || !hash) {
      return false;
    }
    return bcrypt.compare(password, hash);
  }

  /**
   * Genera un par de tokens (Access + Refresh)
   * @param {Object} usuario - Objeto usuario
   * @returns {Object} { accessToken, refreshToken, expiresIn }
   */
  generateTokens(usuario, sessionId = null) {
    if (!usuario || !usuario.id) {
      throw new ValidationException('User object is required');
    }

    // 🔐 SECURITY: Secrets deben estar configurados en .env
    if (!process.env.JWT_SECRET) {
      throw new Error(
        'FATAL ERROR: JWT_SECRET no está configurada. ' +
        'Define JWT_SECRET en .env con una cadena de al menos 32 caracteres.'
      );
    }
    if (!process.env.JWT_REFRESH_SECRET) {
      throw new Error(
        'FATAL ERROR: JWT_REFRESH_SECRET no está configurada. ' +
        'Define JWT_REFRESH_SECRET en .env con una cadena de al menos 32 caracteres.'
      );
    }

    const accessTokenExpiry = this.normalizeExpiry(process.env.JWT_EXPIRATION || '1h');
    const refreshTokenExpiry = this.normalizeExpiry(process.env.JWT_REFRESH_EXPIRATION || '7d');

    const accessPayload = {
      id: usuario.id,
      telefono: usuario.telefono,
      rol_id: usuario.rol_id,
      type: 'access'
    };
    const refreshPayload = {
      id: usuario.id,
      telefono: usuario.telefono,
      type: 'refresh'
    };

    if (sessionId) {
      accessPayload.sid = sessionId;
      refreshPayload.sid = sessionId;
    }

    const accessToken = jwt.sign(
      accessPayload,
      process.env.JWT_SECRET,
      { expiresIn: accessTokenExpiry }
    );

    const refreshToken = jwt.sign(
      refreshPayload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: refreshTokenExpiry }
    );

    return { 
      accessToken, 
      refreshToken,
      expiresIn: this.parseExpiry(accessTokenExpiry)
    };
  }

  /**
   * Realiza Token Rotation: invalida refresh token viejo y genera uno nuevo
   * @param {string} oldRefreshToken - Token antiguo
   * @param {Object} usuario - Objeto usuario
   * @returns {Object} { accessToken, refreshToken, expiresIn }
   */
  async rotateTokens(oldRefreshToken, usuario, sessionId = null) {
    if (!oldRefreshToken || !usuario || !usuario.id) {
      throw new UnauthorizedException('Invalid refresh token or user');
    }

    // Invalidar el refresh token viejo
    await this.blacklistToken(oldRefreshToken, 7 * 24 * 60 * 60, usuario.id, 'rotation');

    // Generar nuevos tokens
    return this.generateTokens(usuario, sessionId);
  }

  /**
   * Agrega un token a la blacklist (para logout)
   * @param {string} token - Token a invalidar
   * @param {number} expiryTime - Tiempo de expiración en segundos
   * @param {number} usuarioId - ID del usuario
   * @param {string} razon - Razón del revoque (logout, rotación, seguridad, etc.)
   */
  async blacklistToken(token, expiryTime = 7 * 24 * 60 * 60, usuarioId = null, razon = 'logout') {
    if (!token) return;
    
    const expiraEn = new Date(Date.now() + expiryTime * 1000);
    
    // Guardar en BD si está disponible (recomendado para producción)
    if (this.tokenBlacklistModel && usuarioId) {
      try {
        await this.tokenBlacklistModel.create({
          token,
          usuario_id: usuarioId,
          expira_en: expiraEn,
          razon
        });
      } catch (error) {
        // Si falla BD, usar fallback en memoria
        console.error('[AuthService] Error al guardar token en blacklist:', error.message);
        this.tokenBlacklistMemory.set(token, expiraEn.getTime());
      }
    } else {
      // Fallback a memoria si no hay model (testing/development)
      this.tokenBlacklistMemory.set(token, expiraEn.getTime());
    }
  }

  /**
   * Verifica si un token está en la blacklist
   * @param {string} token - Token a verificar
   * @returns {Promise<boolean>}
   */
  async isTokenBlacklisted(token) {
    if (!token) return false;
    
    // Verificar en BD si está disponible (más confiable)
    if (this.tokenBlacklistModel) {
      try {
        const tokenEnBlacklist = await this.tokenBlacklistModel.findOne({
          where: { token }
        });
        
        if (tokenEnBlacklist) {
          // Verificar si ya expiró
          if (new Date(tokenEnBlacklist.expira_en) < new Date()) {
            // Limpiar si expiró
            await tokenEnBlacklist.destroy();
            return false;
          }
          return true;
        }
      } catch (error) {
        console.error('[AuthService] Error al verificar token en blacklist:', error.message);
        // Fallback a memoria
      }
    }
    
    // Fallback a memoria
    const expiryTime = this.tokenBlacklistMemory.get(token);
    if (!expiryTime) return false;

    if (expiryTime < Date.now()) {
      this.tokenBlacklistMemory.delete(token);
      return false;
    }

    return true;
  }

  /**
   * Verifica y valida un token de acceso
   * @param {string} token - Token a verificar
   * @returns {Object|null} Payload decodificado o null si inválido
   */
  async verifyToken(token) {
    if (!token) {
      return null;
    }

    // Verificar si está en blacklist
    if (await this.isTokenBlacklisted(token)) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'access') {
        return null;
      }
      return decoded;
    } catch (e) {
      return null;
    }
  }

  /**
   * Verifica y valida un refresh token
   * @param {string} token - Token a verificar
   * @returns {Object|null} Payload decodificado o null si inválido
   */
  async verifyRefreshToken(token) {
    if (!token) {
      return null;
    }

    // Verificar si está en blacklist
    if (await this.isTokenBlacklisted(token)) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      if (decoded.type !== 'refresh') {
        return null;
      }
      return decoded;
    } catch (e) {
      return null;
    }
  }

  /**
   * Convierte una cadena de expiración (ej: "1h", "7d") a milisegundos
   * @param {string} expiryStr - Cadena de expiración
   * @returns {number} Milisegundos
   */
  parseExpiry(expiryStr) {
    if (typeof expiryStr === 'number') {
      return expiryStr * 1000;
    }

    if (/^\d+$/.test(String(expiryStr))) {
      return parseInt(expiryStr) * 1000;
    }

    const units = { s: 1, m: 60, h: 3600, d: 86400 };
    const match = expiryStr.match(/^(\d+)([smhd])$/);
    if (!match) return 3600000; // 1 hora por defecto
    return parseInt(match[1]) * units[match[2]] * 1000;
  }

  normalizeExpiry(expiryStr) {
    if (/^\d+$/.test(String(expiryStr))) {
      return parseInt(expiryStr);
    }
    return expiryStr;
  }
}

class EmailService {
  constructor(transporter) {
    this.transporter = transporter;
  }

  async send(to, subject, html) {
    try {
      if (!this.transporter) {
        console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
        return true;
      }

      return await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@app.com',
        to,
        subject,
        html
      });
    } catch (error) {
      console.error('Email service error:', error.message);
      return false;
    }
  }
}

class SmsService {
  async send(to, message) {
    if (!to || !message) {
      return false;
    }

    console.log(`[SMS Mock] To: ${to}, Message: ${message}`);
    return true;
  }
}

class WhatsAppService {
  async send(to, message) {
    if (!to || !message) {
      return false;
    }

    const apiUrl = process.env.WHATSAPP_API_URL;
    const token = process.env.WHATSAPP_API_TOKEN;

    if (!apiUrl || !token) {
      console.log(`[WhatsApp Mock] To: ${to}, Message: ${message}`);
      return true;
    }

    const payload = JSON.stringify({
      to,
      message
    });
    const url = new URL(apiUrl);
    const client = url.protocol === 'https:'
      ? require('https')
      : require('http');

    return new Promise((resolve) => {
      const req = client.request({
        method: 'POST',
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        res.resume();
        resolve(res.statusCode >= 200 && res.statusCode < 300);
      });

      req.on('error', (error) => {
        console.error('WhatsApp service error:', error.message);
        resolve(false);
      });

      req.write(payload);
      req.end();
    });
  }
}

class CacheService {
  constructor() {
    this.cache = new Map();
  }

  async get(key) {
    if (!key) return null;
    
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key, value, ttl = 300) {
    if (!key || value === null || value === undefined) {
      throw new ValidationException('Key and value are required');
    }
    
    const expiry = ttl ? Date.now() + ttl * 1000 : null;
    this.cache.set(key, { value, expiry });
  }

  async delete(key) {
    if (!key) return;
    this.cache.delete(key);
  }

  async clear() {
    this.cache.clear();
  }

  async getAll() {
    return Array.from(this.cache.entries());
  }
}

module.exports = {
  AuthService,
  EmailService,
  SmsService,
  WhatsAppService,
  CacheService
};
