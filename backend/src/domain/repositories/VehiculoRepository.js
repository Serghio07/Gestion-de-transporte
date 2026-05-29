// Domain - Vehiculo Repository Interface

class VehiculoRepository {
  async create(vehiculo) {
    throw new Error('create() must be implemented');
  }

  async update(id, updates) {
    throw new Error('update() must be implemented');
  }

  async delete(id) {
    throw new Error('delete() must be implemented');
  }

  async findById(id) {
    throw new Error('findById() must be implemented');
  }

  async findAll(filters, pagination) {
    throw new Error('findAll() must be implemented');
  }

  async findByUnidadNro(unidad_nro) {
    throw new Error('findByUnidadNro() must be implemented');
  }

  async countAll() {
    throw new Error('countAll() must be implemented');
  }
}

module.exports = VehiculoRepository;
