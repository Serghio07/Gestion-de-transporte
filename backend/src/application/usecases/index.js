// Use Cases - Business logic orchestration
const { UnauthorizedException, ValidationException, NotFoundException, ConflictException } = require('../../domain/exceptions');

class LoginUseCase {
  constructor(usuarioRepository, authService) {
    this.usuarioRepository = usuarioRepository;
    this.authService = authService;
  }

  async execute(email, password) {
    if (!email || !password) {
      throw new ValidationException('Email and password are required');
    }

    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('Credentials invalid');
    }

    const passwordValid = await this.authService.comparePassword(password, usuario.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Credentials invalid');
    }

    const { accessToken, refreshToken } = await this.authService.generateTokens(usuario);
    return { usuario, accessToken, refreshToken };
  }
}

class CreateUsuarioUseCase {
  constructor(usuarioRepository, authService, emailService) {
    this.usuarioRepository = usuarioRepository;
    this.authService = authService;
    this.emailService = emailService;
  }

  async execute(usuarioDTO) {
    this._validateDTO(usuarioDTO);

    const exists = await this.usuarioRepository.findByEmail(usuarioDTO.email);
    if (exists) {
      throw new ConflictException('User already exists with this email');
    }

    const hashedPassword = await this.authService.hashPassword(usuarioDTO.password);
    const usuario = {
      nombre_usuario: usuarioDTO.nombre_usuario,
      email: usuarioDTO.email,
      password: hashedPassword,
      nombre_completo: usuarioDTO.nombre_completo,
      rol_id: usuarioDTO.rol_id || 2
    };

    const created = await this.usuarioRepository.create(usuario);
    
    // Email notification does not break user creation
    try {
      await this.emailService.send(
        usuarioDTO.email,
        'Bienvenida',
        `Bienvenido ${usuarioDTO.nombre_completo}`
      );
    } catch (e) {
      // Silently fail email notification
    }

    return created;
  }

  _validateDTO(dto) {
    if (!dto.nombre_usuario || !dto.email || !dto.password || !dto.nombre_completo) {
      throw new ValidationException('Missing required fields');
    }
    if (dto.password.length < 6) {
      throw new ValidationException('Password must be at least 6 characters');
    }
  }
}

class GetUsuariosUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(options = {}) {
    return this.usuarioRepository.findAll(options);
  }
}

class GetUsuarioByIdUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id) {
    if (!id) {
      throw new ValidationException('ID is required');
    }
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario', id);
    }
    return usuario;
  }
}

class UpdateUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id, usuarioDTO) {
    if (!id) {
      throw new ValidationException('ID is required');
    }
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario', id);
    }

    const updated = await this.usuarioRepository.update(id, usuarioDTO);
    return updated;
  }
}

class DeleteUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id) {
    if (!id) {
      throw new ValidationException('ID is required');
    }
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario', id);
    }

    return this.usuarioRepository.delete(id);
  }
}

module.exports = {
  LoginUseCase,
  CreateUsuarioUseCase,
  GetUsuariosUseCase,
  GetUsuarioByIdUseCase,
  UpdateUsuarioUseCase,
  DeleteUsuarioUseCase
};
