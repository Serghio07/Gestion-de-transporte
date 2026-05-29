// Domain - Usuario Repository Interface

class UsuarioRepository {
  async create(usuario) {
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

  async findByEmail(email) {
    throw new Error('findByEmail() must be implemented');
  }

  async findByTelefono(telefono) {
    throw new Error('findByTelefono() must be implemented');
  }

  async findAll(filters, pagination) {
    throw new Error('findAll() must be implemented');
  }

  async countAll() {
    throw new Error('countAll() must be implemented');
  }
}

module.exports = UsuarioRepository;
