// Application - Jornada Use Cases

const { ValidationException, NotFoundException } = require('../../domain/exceptions');

class CreateJornadaUseCase {
  constructor(jornadaRepository, usuarioRepository, vehiculoRepository) {
    this.jornadaRepository = jornadaRepository;
    this.usuarioRepository = usuarioRepository;
    this.vehiculoRepository = vehiculoRepository;
  }

  async execute(createJornadaDTO) {
    if (!createJornadaDTO.usuario_id) {
      throw new ValidationException('Usuario ID es requerido');
    }
    if (!createJornadaDTO.vehiculo_id) {
      throw new ValidationException('Vehículo ID es requerido');
    }

    const usuario = await this.usuarioRepository.findById(createJornadaDTO.usuario_id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const vehiculo = await this.vehiculoRepository.findById(createJornadaDTO.vehiculo_id);
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    const jornada = await this.jornadaRepository.create(createJornadaDTO);
    return jornada;
  }
}

class GetAllJornadasUseCase {
  constructor(jornadaRepository) {
    this.jornadaRepository = jornadaRepository;
  }

  async execute(filters, pagination) {
    return await this.jornadaRepository.findAll(filters, pagination);
  }
}

class GetJornadaByIdUseCase {
  constructor(jornadaRepository) {
    this.jornadaRepository = jornadaRepository;
  }

  async execute(id) {
    const jornada = await this.jornadaRepository.findById(id);
    if (!jornada) {
      throw new NotFoundException('Jornada no encontrada');
    }
    return jornada;
  }
}

class UpdateJornadaUseCase {
  constructor(jornadaRepository) {
    this.jornadaRepository = jornadaRepository;
  }

  async execute(id, updateJornadaDTO) {
    const jornada = await this.jornadaRepository.findById(id);
    if (!jornada) {
      throw new NotFoundException('Jornada no encontrada');
    }

    const updated = await this.jornadaRepository.update(id, updateJornadaDTO);
    return updated;
  }
}

class DeleteJornadaUseCase {
  constructor(jornadaRepository) {
    this.jornadaRepository = jornadaRepository;
  }

  async execute(id) {
    const jornada = await this.jornadaRepository.findById(id);
    if (!jornada) {
      throw new NotFoundException('Jornada no encontrada');
    }

    const deleted = await this.jornadaRepository.delete(id);
    return deleted;
  }
}

module.exports = {
  CreateJornadaUseCase,
  GetAllJornadasUseCase,
  GetJornadaByIdUseCase,
  UpdateJornadaUseCase,
  DeleteJornadaUseCase
};
