// Application - Usuario Use Cases

const { ValidationException, NotFoundException } = require('../../domain/exceptions');
const bcrypt = require('bcryptjs');

class CreateUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(createUsuarioDTO) {
    if (!createUsuarioDTO.nombre) {
      throw new ValidationException('Nombre es requerido');
    }
    if (!createUsuarioDTO.telefono) {
      throw new ValidationException('Telefono es requerido');
    }
    if (!createUsuarioDTO.password) {
      throw new ValidationException('Contraseña es requerida');
    }

    const existing = await this.usuarioRepository.findByTelefono(createUsuarioDTO.telefono);
    if (existing) {
      throw new ValidationException('Telefono ya existe');
    }

    const hashedPassword = await bcrypt.hash(createUsuarioDTO.password, 10);
    const usuarioData = {
      nombre: createUsuarioDTO.nombre,
      apellido: createUsuarioDTO.apellido || null,
      email: createUsuarioDTO.email || null,
      telefono: createUsuarioDTO.telefono,
      empresa_id: createUsuarioDTO.empresa_id || null,
      empresa_transporte: createUsuarioDTO.empresa_transporte || null,
      foto_url: createUsuarioDTO.foto_url || null,
      password_hash: hashedPassword,
      rol_id: createUsuarioDTO.rol_id,
      activo: createUsuarioDTO.estado ? createUsuarioDTO.estado === 'activo' : true,
      telefono_verificado_en: new Date()
    };

    const usuario = await this.usuarioRepository.create(usuarioData);
    return usuario;
  }
}

class GetAllUsuariosUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(filters, pagination) {
    return await this.usuarioRepository.findAll(filters, pagination);
  }
}

class GetUsuarioByIdUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }
}

class UpdateUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id, updateUsuarioDTO) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUsuarioDTO.password) {
      updateUsuarioDTO.password_hash = await bcrypt.hash(updateUsuarioDTO.password, 10);
    }
    delete updateUsuarioDTO.password;

    if (updateUsuarioDTO.estado !== null && updateUsuarioDTO.estado !== undefined) {
      updateUsuarioDTO.activo = updateUsuarioDTO.estado === 'activo';
    }
    delete updateUsuarioDTO.estado;

    const updated = await this.usuarioRepository.update(id, updateUsuarioDTO);
    return updated;
  }
}

class DeleteUsuarioUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(id) {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const deleted = await this.usuarioRepository.delete(id);
    return deleted;
  }
}

class LoginUseCase {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  async execute(email, password) {
    if (!email || !password) {
      throw new ValidationException('Email y contraseña son requeridos');
    }

    const usuario = await this.usuarioRepository.findByEmail(email);
    if (!usuario) {
      throw new NotFoundException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordMatch) {
      throw new ValidationException('Credenciales inválidas');
    }

    return usuario;
  }
}

module.exports = {
  CreateUsuarioUseCase,
  GetAllUsuariosUseCase,
  GetUsuarioByIdUseCase,
  UpdateUsuarioUseCase,
  DeleteUsuarioUseCase,
  LoginUseCase
};
