// Infrastructure - Role Repository Implementation

const RoleRepository = require('../../domain/repositories/RoleRepository');

class RoleRepositoryImpl extends RoleRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(roleData) {
    return await this.db.models.Role.create(roleData);
  }

  async update(id, updates) {
    const role = await this.db.models.Role.findByPk(id);
    if (!role) return null;
    return await role.update(updates);
  }

  async delete(id) {
    const role = await this.db.models.Role.findByPk(id);
    if (!role) return false;
    await role.destroy();
    return true;
  }

  async findById(id) {
    return await this.db.models.Role.findByPk(id);
  }

  async findAll(pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const { count, rows } = await this.db.models.Role.findAndCountAll({
      offset,
      limit: pagination.limit,
      order: [['nombre', 'ASC']]
    });

    return {
      data: rows,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count,
        pages: Math.ceil(count / pagination.limit)
      }
    };
  }

  async findByNombre(nombre) {
    return await this.db.models.Role.findOne({ where: { nombre } });
  }

  async countAll() {
    return await this.db.models.Role.count();
  }
}

module.exports = RoleRepositoryImpl;
