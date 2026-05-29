// Infrastructure - ChecklistDiario Repository Implementation

const ChecklistRepository = require('../../domain/repositories/ChecklistRepository');

class ChecklistRepositoryImpl extends ChecklistRepository {
  constructor(db) {
    super();
    this.db = db;
  }

  async create(checklistData) {
    return await this.db.models.ChecklistDiario.create(checklistData);
  }

  async update(id, updates) {
    const checklist = await this.db.models.ChecklistDiario.findByPk(id);
    if (!checklist) return null;
    return await checklist.update(updates);
  }

  async delete(id) {
    const checklist = await this.db.models.ChecklistDiario.findByPk(id);
    if (!checklist) return false;
    await checklist.destroy();
    return true;
  }

  async findById(id) {
    return await this.db.models.ChecklistDiario.findByPk(id, {
      include: [{ model: this.db.models.Jornada, as: 'jornada' }]
    });
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const offset = (pagination.page - 1) * pagination.limit;
    const where = {};

    if (filters.jornada_id) where.jornada_id = filters.jornada_id;
    if (filters.llantas_ok !== undefined) where.llantas_ok = filters.llantas_ok === true || filters.llantas_ok === 'true';

    const { count, rows } = await this.db.models.ChecklistDiario.findAndCountAll({
      where,
      include: [{ model: this.db.models.Jornada, as: 'jornada' }],
      offset,
      limit: pagination.limit,
      order: [['id', 'ASC']]
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

  async findByJornadaId(jornada_id) {
    return await this.db.models.ChecklistDiario.findAll({
      where: { jornada_id },
      include: [{ model: this.db.models.Jornada, as: 'jornada' }],
      order: [['id', 'ASC']]
    });
  }

  async countAll() {
    return await this.db.models.ChecklistDiario.count();
  }
}

module.exports = ChecklistRepositoryImpl;
