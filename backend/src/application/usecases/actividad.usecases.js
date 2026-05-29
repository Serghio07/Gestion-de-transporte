// Application - Actividad Use Cases

const { ValidationException, NotFoundException } = require('../../domain/exceptions');

class CreateActividadUseCase {
  constructor(actividadRepository, jornadaRepository) {
    this.actividadRepository = actividadRepository;
    this.jornadaRepository = jornadaRepository;
  }

  async execute(createActividadDTO) {
    if (!createActividadDTO.jornada_id) {
      throw new ValidationException('Jornada ID es requerida');
    }
    if (!createActividadDTO.tipo_actividad) {
      throw new ValidationException('Tipo de actividad es requerido');
    }
    if (!createActividadDTO.monto_gastado) {
      throw new ValidationException('Monto gastado es requerido');
    }

    const jornada = await this.jornadaRepository.findById(createActividadDTO.jornada_id);
    if (!jornada) {
      throw new NotFoundException('Jornada no encontrada');
    }

    const actividad = await this.actividadRepository.create(createActividadDTO);
    return actividad;
  }
}

class GetAllActividadesUseCase {
  constructor(actividadRepository) {
    this.actividadRepository = actividadRepository;
  }

  async execute(filters, pagination) {
    return await this.actividadRepository.findAll(filters, pagination);
  }
}

class GetActividadByIdUseCase {
  constructor(actividadRepository) {
    this.actividadRepository = actividadRepository;
  }

  async execute(id) {
    const actividad = await this.actividadRepository.findById(id);
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }
    return actividad;
  }
}

class UpdateActividadUseCase {
  constructor(actividadRepository) {
    this.actividadRepository = actividadRepository;
  }

  async execute(id, updateActividadDTO) {
    const actividad = await this.actividadRepository.findById(id);
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    const updated = await this.actividadRepository.update(id, updateActividadDTO);
    return updated;
  }
}

class DeleteActividadUseCase {
  constructor(actividadRepository) {
    this.actividadRepository = actividadRepository;
  }

  async execute(id) {
    const actividad = await this.actividadRepository.findById(id);
    if (!actividad) {
      throw new NotFoundException('Actividad no encontrada');
    }

    const deleted = await this.actividadRepository.delete(id);
    return deleted;
  }
}

module.exports = {
  CreateActividadUseCase,
  GetAllActividadesUseCase,
  GetActividadByIdUseCase,
  UpdateActividadUseCase,
  DeleteActividadUseCase
};
