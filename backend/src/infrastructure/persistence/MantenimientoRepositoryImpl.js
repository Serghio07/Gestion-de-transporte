// Infrastructure - MantenimientoVidaUtil Repository Implementation

const MantenimientoRepository = require('../../domain/repositories/MantenimientoRepository');

class MantenimientoRepositoryImpl extends MantenimientoRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(mantenimientoData) {
    return await this.db.models.MantenimientoVidaUtil.create(mantenimientoData);
  }

  async update(id, updates) {
    const mantenimiento = await this.db.models.MantenimientoVidaUtil.findByPk(id);
    if (!mantenimiento) return null;
    return await mantenimiento.update(updates);
  }

  async delete(id) {
    const mantenimiento = await this.db.models.MantenimientoVidaUtil.findByPk(id);
    if (!mantenimiento) return false;
    await mantenimiento.destroy();
    return true;
  }

  async findById(id) {
    return await this.db.models.MantenimientoVidaUtil.findByPk(id, {
      include: [{ model: this.db.models.Vehiculo, as: 'vehiculo' }]
    });
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const where = {};

    if (filters.vehiculo_id) where.vehiculo_id = filters.vehiculo_id;
    if (filters.tipo_servicio) where.tipo_servicio = filters.tipo_servicio;
    if (filters.tipo_mantenimiento) where.tipo_servicio = filters.tipo_mantenimiento;

    const { count, rows } = await this.db.models.MantenimientoVidaUtil.findAndCountAll({
      where,
      include: [{ model: this.db.models.Vehiculo, as: 'vehiculo' }],
      offset,
      limit: pagination.limit,
      order: [['fecha_servicio', 'DESC']]
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

  async findByVehiculoId(vehiculo_id, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const { count, rows } = await this.db.models.MantenimientoVidaUtil.findAndCountAll({
      where: { vehiculo_id },
      include: [{ model: this.db.models.Vehiculo, as: 'vehiculo' }],
      offset,
      limit: pagination.limit,
      order: [['fecha_servicio', 'DESC']]
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
    return await this.db.models.MantenimientoVidaUtil.count();
  }
}

module.exports = MantenimientoRepositoryImpl;
