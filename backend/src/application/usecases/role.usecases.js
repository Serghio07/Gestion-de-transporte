// Application - Role Use Cases

const { ValidationException, NotFoundException } = require('../../domain/exceptions');

class CreateRoleUseCase {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(createRoleDTO) {
    if (!createRoleDTO.nombre) {
      throw new ValidationException('Nombre del rol es requerido');
    }

    const existing = await this.roleRepository.findByNombre(createRoleDTO.nombre);
    if (existing) {
      throw new ValidationException('Rol ya existe');
    }

    const role = await this.roleRepository.create(createRoleDTO);
    return role;
  }
}

class GetAllRolesUseCase {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(pagination) {
    return await this.roleRepository.findAll(pagination);
  }
}

class GetRoleByIdUseCase {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(id) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    return role;
  }
}

class UpdateRoleUseCase {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(id, updateRoleDTO) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const updated = await this.roleRepository.update(id, updateRoleDTO);
    return updated;
  }
}

class DeleteRoleUseCase {
  constructor(roleRepository) {
    this.roleRepository = roleRepository;
  }

  async execute(id) {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const deleted = await this.roleRepository.delete(id);
    return deleted;
  }
}

module.exports = {
  CreateRoleUseCase,
  GetAllRolesUseCase,
  GetRoleByIdUseCase,
  UpdateRoleUseCase,
  DeleteRoleUseCase
};
