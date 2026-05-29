// Application - Checklist Use Cases

const { ValidationException, NotFoundException } = require('../../domain/exceptions');

class CreateChecklistUseCase {
  constructor(checklistRepository, jornadaRepository) {
    this.checklistRepository = checklistRepository;
    this.jornadaRepository = jornadaRepository;
  }

  async execute(createChecklistDTO) {
    if (!createChecklistDTO.jornada_id) {
      throw new ValidationException('Jornada ID es requerida');
    }
    if (typeof createChecklistDTO.llantas_ok !== 'boolean') {
      throw new ValidationException('llantas_ok es requerido');
    }

    const jornada = await this.jornadaRepository.findById(createChecklistDTO.jornada_id);
    if (!jornada) {
      throw new NotFoundException('Jornada no encontrada');
    }

    const checklist = await this.checklistRepository.create(createChecklistDTO);
    return checklist;
  }
}

class GetAllChecklistsUseCase {
  constructor(checklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  async execute(filters, pagination) {
    return await this.checklistRepository.findAll(filters, pagination);
  }
}

class GetChecklistByIdUseCase {
  constructor(checklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  async execute(id) {
    const checklist = await this.checklistRepository.findById(id);
    if (!checklist) {
      throw new NotFoundException('Checklist no encontrado');
    }
    return checklist;
  }
}

class UpdateChecklistUseCase {
  constructor(checklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  async execute(id, updateChecklistDTO) {
    const checklist = await this.checklistRepository.findById(id);
    if (!checklist) {
      throw new NotFoundException('Checklist no encontrado');
    }

    const updated = await this.checklistRepository.update(id, updateChecklistDTO);
    return updated;
  }
}

class DeleteChecklistUseCase {
  constructor(checklistRepository) {
    this.checklistRepository = checklistRepository;
  }

  async execute(id) {
    const checklist = await this.checklistRepository.findById(id);
    if (!checklist) {
      throw new NotFoundException('Checklist no encontrado');
    }

    const deleted = await this.checklistRepository.delete(id);
    return deleted;
  }
}

module.exports = {
  CreateChecklistUseCase,
  GetAllChecklistsUseCase,
  GetChecklistByIdUseCase,
  UpdateChecklistUseCase,
  DeleteChecklistUseCase
};
