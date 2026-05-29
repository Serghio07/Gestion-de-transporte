// Domain - Jornada Repository Interface

class JornadaRepository {
  async create(jornada) {
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

  async findByUsuarioId(usuario_id, pagination) {
    throw new Error('findByUsuarioId() must be implemented');
  }

  async findActiveByUsuario(usuario_id) {
    throw new Error('findActiveByUsuario() must be implemented');
  }

  async countAll() {
    throw new Error('countAll() must be implemented');
  }
}

module.exports = JornadaRepository;
