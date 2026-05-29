// Domain - MantenimientoVidaUtil Repository Interface

class MantenimientoRepository {
  async create(mantenimiento) {
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

  async findByVehiculoId(vehiculo_id, pagination) {
    throw new Error('findByVehiculoId() must be implemented');
  }

  async countAll() {
    throw new Error('countAll() must be implemented');
  }
}

module.exports = MantenimientoRepository;
