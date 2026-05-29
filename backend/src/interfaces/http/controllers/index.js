// HTTP Controllers - Interface adapters for HTTP layer

const { formatResponse } = require('../../../shared/utils');

const sanitizeUsuario = (usuario) => {
  if (!usuario) return usuario;
  const plain = typeof usuario.toJSON === 'function' ? usuario.toJSON() : { ...usuario };
  delete plain.password_hash;
  return plain;
};

class UsuarioController {
  constructor(createUsuarioUseCase, getUsuariosUseCase, getUsuarioByIdUseCase, updateUsuarioUseCase, deleteUsuarioUseCase) {
    this.createUsuarioUseCase = createUsuarioUseCase;
    this.getUsuariosUseCase = getUsuariosUseCase;
    this.getUsuarioByIdUseCase = getUsuarioByIdUseCase;
    this.updateUsuarioUseCase = updateUsuarioUseCase;
    this.deleteUsuarioUseCase = deleteUsuarioUseCase;
  }

  async create(req, res, next) {
    try {
      const resultado = await this.createUsuarioUseCase.execute(req.body);
      res.status(201).json(
        formatResponse(true, 'Usuario created successfully', sanitizeUsuario(resultado))
      );
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const resultado = await this.getUsuariosUseCase.execute({ 
        page: parseInt(page), 
        limit: parseInt(limit) 
      });
      res.json(
        formatResponse(
          true, 
          'Usuarios retrieved successfully', 
          resultado.data.map(sanitizeUsuario), 
          resultado.pagination
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const resultado = await this.getUsuarioByIdUseCase.execute(req.params.id);
      res.json(
        formatResponse(true, 'Usuario retrieved successfully', sanitizeUsuario(resultado))
      );
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const resultado = await this.updateUsuarioUseCase.execute(req.params.id, req.body);
      res.json(
        formatResponse(true, 'Usuario updated successfully', sanitizeUsuario(resultado))
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await this.deleteUsuarioUseCase.execute(req.params.id);
      res.json(
        formatResponse(true, 'Usuario deleted successfully')
      );
    } catch (error) {
      next(error);
    }
  }
}

class AuthController {
  constructor(loginUseCase) {
    this.loginUseCase = loginUseCase;
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const resultado = await this.loginUseCase.execute(email, password);
      res.json(
        formatResponse(
          true, 
          'Login successful', 
          {
            usuario: resultado.usuario,
            accessToken: resultado.accessToken,
            refreshToken: resultado.refreshToken
          }
        )
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  UsuarioController,
  AuthController
};
