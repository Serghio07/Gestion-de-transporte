// Infrastructure - Reporte PDF Repository Implementation

const ReporteRepository = require('../../domain/repositories/ReporteRepository');

class ReporteRepositoryImpl extends ReporteRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(reporteData) {
    return await this.db.models.ReportePdf.create(reporteData);
  }

  async update(id, updates) {
    const reporte = await this.db.models.ReportePdf.findByPk(id);
    if (!reporte) return null;
    return await reporte.update(updates);
  }

  async delete(id) {
    const reporte = await this.db.models.ReportePdf.findByPk(id);
    if (!reporte) return false;
    await reporte.destroy();
    return true;
  }

  async findById(id) {
    return await this.db.models.ReportePdf.findByPk(id, {
      include: [{ model: this.db.models.Usuario, as: 'generado_por' }]
    });
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const where = {};

    if (filters.tipo_reporte) where.tipo_reporte = filters.tipo_reporte;
    if (filters.generado_por_id) where.generado_por_id = filters.generado_por_id;

    const { count, rows } = await this.db.models.ReportePdf.findAndCountAll({
      where,
      include: [{ model: this.db.models.Usuario, as: 'generado_por' }],
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

  async findByJornadaId(jornada_id, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const { count, rows } = await this.db.models.ReportePdf.findAndCountAll({
      where: { },
      include: [{ model: this.db.models.Usuario, as: 'generado_por' }],
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

  async countAll() {
    return await this.db.models.ReportePdf.count();
  }
}

module.exports = ReporteRepositoryImpl;
