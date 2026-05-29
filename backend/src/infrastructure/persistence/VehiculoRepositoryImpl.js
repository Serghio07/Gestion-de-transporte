// Infrastructure - Vehiculo Repository Implementation

const VehiculoRepository = require('../../domain/repositories/VehiculoRepository');

class VehiculoRepositoryImpl extends VehiculoRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(vehiculoData) {
    return await this.db.models.Vehiculo.create(vehiculoData);
  }

  async update(id, updates) {
    const vehiculo = await this.db.models.Vehiculo.findByPk(id);
    if (!vehiculo) return null;
    return await vehiculo.update(updates);
  }

  async delete(id) {
    const vehiculo = await this.db.models.Vehiculo.findByPk(id);
    if (!vehiculo) return false;
    await vehiculo.destroy();
    return true;
  }

  async findById(id) {
    return await this.db.models.Vehiculo.findByPk(id);
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const where = {};

    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.unidad_nro) where.unidad_nro = { [this.db.Sequelize.Op.iLike]: `%${filters.unidad_nro}%` };
    if (filters.activo !== undefined) where.activo = filters.activo === true || filters.activo === 'true';

    const { count, rows } = await this.db.models.Vehiculo.findAndCountAll({
      where,
      offset,
      limit: pagination.limit,
      order: [['creado_en', 'DESC']]
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

  async findByUnidadNro(unidad_nro) {
    return await this.db.models.Vehiculo.findOne({ where: { unidad_nro } });
  }

  async countAll() {
    return await this.db.models.Vehiculo.count();
  }
}

module.exports = VehiculoRepositoryImpl;
