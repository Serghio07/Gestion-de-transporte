// Application - Mantenimiento Use Cases

const { ValidationException, NotFoundException } = require('../../domain/exceptions');
class CreateMantenimientoUseCase {
  constructor(mantenimientoRepository, vehiculoRepository) {
    this.mantenimientoRepository = mantenimientoRepository;
    this.vehiculoRepository = vehiculoRepository;
  }

  async execute(createMantenimientoDTO) {
    if (!createMantenimientoDTO.vehiculo_id) {
      throw new ValidationException('Vehículo ID es requerido');
    }
    if (!createMantenimientoDTO.tipo_servicio) {
      throw new ValidationException('Tipo de servicio es requerido');
    }

    const vehiculo = await this.vehiculoRepository.findById(createMantenimientoDTO.vehiculo_id);
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    const mantenimiento = await this.mantenimientoRepository.create(createMantenimientoDTO);
    return mantenimiento;
  }
}

class GetAllMantenimientosUseCase {
  constructor(mantenimientoRepository) {
    this.mantenimientoRepository = mantenimientoRepository;
  }

  async execute(filters, pagination) {
    return await this.mantenimientoRepository.findAll(filters, pagination);
  }
}

class GetMantenimientoByIdUseCase {
  constructor(mantenimientoRepository) {
    this.mantenimientoRepository = mantenimientoRepository;
  }

  async execute(id) {
    const mantenimiento = await this.mantenimientoRepository.findById(id);
    if (!mantenimiento) {
      throw new NotFoundException('Mantenimiento no encontrado');
    }
    return mantenimiento;
  }
}

class UpdateMantenimientoUseCase {
  constructor(mantenimientoRepository) {
    this.mantenimientoRepository = mantenimientoRepository;
  }

  async execute(id, updateMantenimientoDTO) {
    const mantenimiento = await this.mantenimientoRepository.findById(id);
    if (!mantenimiento) {
      throw new NotFoundException('Mantenimiento no encontrado');
    }

    const updated = await this.mantenimientoRepository.update(id, updateMantenimientoDTO);
    return updated;
  }
}

class DeleteMantenimientoUseCase {
  constructor(mantenimientoRepository) {
    this.mantenimientoRepository = mantenimientoRepository;
  }

  async execute(id) {
    const mantenimiento = await this.mantenimientoRepository.findById(id);
    if (!mantenimiento) {
      throw new NotFoundException('Mantenimiento no encontrado');
    }

    const deleted = await this.mantenimientoRepository.delete(id);
    return deleted;
  }
}

module.exports = {
  CreateMantenimientoUseCase,
  GetAllMantenimientosUseCase,
  GetMantenimientoByIdUseCase,
  UpdateMantenimientoUseCase,
  DeleteMantenimientoUseCase
};
