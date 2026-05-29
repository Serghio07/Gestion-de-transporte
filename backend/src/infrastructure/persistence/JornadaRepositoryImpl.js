// Infrastructure - Jornada Repository Implementation

const JornadaRepository = require('../../domain/repositories/JornadaRepository');

class JornadaRepositoryImpl extends JornadaRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(jornadaData) {
    return await this.db.models.Jornada.create(jornadaData);
  }

  async update(id, updates) {
    const jornada = await this.db.models.Jornada.findByPk(id);
    if (!jornada) return null;
    return await jornada.update(updates);
  }

  async delete(id) {
    const jornada = await this.db.models.Jornada.findByPk(id);
    if (!jornada) return false;
    await jornada.destroy();
    return true;
  }

  async findById(id) {
    return await this.db.models.Jornada.findByPk(id, {
      include: [
        { model: this.db.models.Usuario, as: 'usuario' },
        { model: this.db.models.Vehiculo, as: 'vehiculo' },
        { model: this.db.models.ChecklistDiario, as: 'checklist' }
      ]
    });
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const where = {};

    if (filters.estado) where.estado = filters.estado;
    if (filters.usuario_id) where.usuario_id = filters.usuario_id;
    if (filters.vehiculo_id) where.vehiculo_id = filters.vehiculo_id;

    const { count, rows } = await this.db.models.Jornada.findAndCountAll({
      where,
      include: [
        { model: this.db.models.Usuario, as: 'usuario' },
        { model: this.db.models.Vehiculo, as: 'vehiculo' },
        { model: this.db.models.ChecklistDiario, as: 'checklist' }
      ],
      offset,
      limit: pagination.limit,
      order: [['fecha_hora_inicio', 'DESC']]
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

  async findByUsuarioId(usuario_id, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const { count, rows } = await this.db.models.Jornada.findAndCountAll({
      where: { usuario_id },
      include: [
        { model: this.db.models.Usuario, as: 'usuario' },
        { model: this.db.models.Vehiculo, as: 'vehiculo' },
        { model: this.db.models.ChecklistDiario, as: 'checklist' }
      ],
      offset,
      limit: pagination.limit,
      order: [['fecha_hora_inicio', 'DESC']]
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

  async findActiveByUsuario(usuario_id) {
    return await this.db.models.Jornada.findOne({
      where: { usuario_id, estado: 'activa' },
      include: [
        { model: this.db.models.Usuario, as: 'usuario' },
        { model: this.db.models.Vehiculo, as: 'vehiculo' },
        { model: this.db.models.ChecklistDiario, as: 'checklist' }
      ]
    });
  }

  async countAll() {
    return await this.db.models.Jornada.count();
  }
}

module.exports = JornadaRepositoryImpl;
