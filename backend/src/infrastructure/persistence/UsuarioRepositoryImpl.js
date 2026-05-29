// Infrastructure - Usuario Repository Implementation

const UsuarioRepository = require('../../domain/repositories/UsuarioRepository');

class UsuarioRepositoryImpl extends UsuarioRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(usuarioData) {
    return await this.db.models.Usuario.create(usuarioData);
  }

  async update(id, updates) {
    const usuario = await this.db.models.Usuario.findByPk(id);
    if (!usuario) return null;
    return await usuario.update(updates);
  }

  async delete(id) {
    const usuario = await this.db.models.Usuario.findByPk(id);
    if (!usuario) return false;
    await usuario.destroy();
    return true;
  }

  async findById(id) {
    return await this.db.models.Usuario.findByPk(id);
  }

  async findByEmail(email) {
    return await this.db.models.Usuario.findOne({
      where: { email }
    });
  }

  async findByTelefono(telefono) {
    return await this.db.models.Usuario.findOne({
      where: { telefono }
    });
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const where = {};

    if (filters.nombre) where.nombre = { [this.db.Sequelize.Op.iLike]: `%${filters.nombre}%` };
    if (filters.rol_id) where.rol_id = filters.rol_id;
    if (filters.estado) where.estado = filters.estado;

    const { count, rows } = await this.db.models.Usuario.findAndCountAll({
      where,
      offset,
      limit: pagination.limit,
      order: [['creado_en', 'DESC']],
      include: [{ model: this.db.models.Role, as: 'role', attributes: ['id', 'nombre'] }]
    });

    return {
      data: rows,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: count,
        pages: Math.ceil(count / pagination.limit),
        hasMore: offset + pagination.limit < count
      }
    };
  }

  async countAll() {
    return await this.db.models.Usuario.count();
  }
}

module.exports = UsuarioRepositoryImpl;
