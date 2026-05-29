// Application - Vehiculo Use Cases

const { ValidationException, NotFoundException } = require('../../domain/exceptions');

class CreateVehiculoUseCase {
  constructor(vehiculoRepository) {
    this.vehiculoRepository = vehiculoRepository;
  }

  async execute(createVehiculoDTO) {
    if (!createVehiculoDTO.unidad_nro) {
      throw new ValidationException('Unidad número es requerida');
    }
    if (!createVehiculoDTO.tipo) {
      throw new ValidationException('Tipo de vehículo es requerido');
    }

    const existing = await this.vehiculoRepository.findByUnidadNro(createVehiculoDTO.unidad_nro);
    if (existing) {
      throw new ValidationException('Unidad número ya existe');
    }

    const vehiculo = await this.vehiculoRepository.create(createVehiculoDTO);
    return vehiculo;
  }
}

class GetAllVehiculosUseCase {
  constructor(vehiculoRepository) {
    this.vehiculoRepository = vehiculoRepository;
  }

  async execute(filters, pagination) {
    return await this.vehiculoRepository.findAll(filters, pagination);
  }
}

class GetVehiculoByIdUseCase {
  constructor(vehiculoRepository) {
    this.vehiculoRepository = vehiculoRepository;
  }

  async execute(id) {
    const vehiculo = await this.vehiculoRepository.findById(id);
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return vehiculo;
  }
}

class UpdateVehiculoUseCase {
  constructor(vehiculoRepository) {
    this.vehiculoRepository = vehiculoRepository;
  }

  async execute(id, updateVehiculoDTO) {
    const vehiculo = await this.vehiculoRepository.findById(id);
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    const updated = await this.vehiculoRepository.update(id, updateVehiculoDTO);
    return updated;
  }
}

class DeleteVehiculoUseCase {
  constructor(vehiculoRepository) {
    this.vehiculoRepository = vehiculoRepository;
  }

  async execute(id) {
    const vehiculo = await this.vehiculoRepository.findById(id);
    if (!vehiculo) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    const deleted = await this.vehiculoRepository.delete(id);
    return deleted;
  }
}

module.exports = {
  CreateVehiculoUseCase,
  GetAllVehiculosUseCase,
  GetVehiculoByIdUseCase,
  UpdateVehiculoUseCase,
  DeleteVehiculoUseCase
};
