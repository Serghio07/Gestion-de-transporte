// Infrastructure - ActividadGasto Repository Implementation

const ActividadRepository = require('../../domain/repositories/ActividadRepository');

class ActividadRepositoryImpl extends ActividadRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(actividadData) {
    return await this.db.models.ActividadGasto.create(actividadData);
  }

  async update(id, updates) {
    const actividad = await this.db.models.ActividadGasto.findByPk(id);
    if (!actividad) return null;
    return await actividad.update(updates);
  }

  async delete(id) {
    const actividad = await this.db.models.ActividadGasto.findByPk(id);
    if (!actividad) return false;
    await actividad.destroy();
    return true;
  }

  async findById(id) {
    return await this.db.models.ActividadGasto.findByPk(id, {
      include: [{ model: this.db.models.Jornada, as: 'jornada' }]
    });
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const where = {};

    if (filters.jornada_id) where.jornada_id = filters.jornada_id;
    if (filters.tipo_actividad) where.tipo_actividad = filters.tipo_actividad;

    const { count, rows } = await this.db.models.ActividadGasto.findAndCountAll({
      where,
      include: [{ model: this.db.models.Jornada, as: 'jornada' }],
      offset,
      limit: pagination.limit,
      order: [['fecha_registro', 'DESC']]
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

  async findByJornadaId(jornada_id, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const { count, rows } = await this.db.models.ActividadGasto.findAndCountAll({
      where: { jornada_id },
      include: [{ model: this.db.models.Jornada, as: 'jornada' }],
      offset,
      limit: pagination.limit,
      order: [['fecha_registro', 'DESC']]
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

  async countAll() {
    return await this.db.models.ActividadGasto.count();
  }
}

module.exports = ActividadRepositoryImpl;
