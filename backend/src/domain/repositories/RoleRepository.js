// Domain - Role Repository Interface

class RoleRepository {
  async create(role) {
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

  async findAll(pagination) {
    throw new Error('findAll() must be implemented');
  }

  async findByNombre(nombre) {
    throw new Error('findByNombre() must be implemented');
  }

  async countAll() {
    throw new Error('countAll() must be implemented');
  }
}

module.exports = RoleRepository;
