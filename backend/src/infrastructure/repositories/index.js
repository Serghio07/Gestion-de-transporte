// Infrastructure - Repository implementations
const { Op } = require('sequelize');

class UsuarioRepository {
  constructor(sequelizeModel) {
    this.model = sequelizeModel;
  }

  async findById(id) {
    return this.model.findByPk(id);
  }

  async findByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  async findByTelefono(telefono) {
    return this.model.findOne({ where: { telefono } });
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = pagination;
    const offset = (page - 1) * limit;
    const where = {};
    if (filters.empresa_id) where.empresa_id = filters.empresa_id;
    if (filters.rol_id) where.rol_id = filters.rol_id;

    const { count, rows } = await this.model.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
      include: [
        { model: this.model.sequelize.models.Role, as: 'role', attributes: ['id', 'nombre'] },
        { model: this.model.sequelize.models.Empresa, as: 'empresa', attributes: ['id', 'nombre'] }
      ]
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    await this.model.update(data, { where: { id } });
    return this.findById(id);
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }
}

class VehiculoRepository {
  constructor(sequelizeModel) {
    this.model = sequelizeModel;
  }

  async findById(id) {
    return this.model.findByPk(id, {
      include: [
        { model: this.model.sequelize.models.Usuario, as: 'conductor', attributes: ['id', 'nombre', 'apellido'] }
      ]
    });
  }

  async findByPlaca(placa) {
    return this.model.findOne({ where: { placa } });
  }

  async findByUnidadNro(unidad_nro) {
    return this.model.findOne({ where: { unidad_nro } });
  }

  async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = pagination;
    const offset = (page - 1) * limit;
    const where = {};

    if (filters.tipo) where.tipo = filters.tipo;
    if (filters.unidad_nro) {
      where.unidad_nro = { [Op.iLike]: `%${filters.unidad_nro}%` };
    }
    if (filters.activo !== undefined) where.activo = filters.activo === true || filters.activo === 'true';
    if (filters.empresa_id) where.empresa_id = filters.empresa_id;

    const { count, rows } = await this.model.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
      include: [
        { model: this.model.sequelize.models.Usuario, as: 'conductor', attributes: ['id', 'nombre', 'apellido'] }
      ]
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    await this.model.update(data, { where: { id } });
    return this.findById(id);
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }

  async findOperational() {
    return this.model.findAll({ where: { activo: true } });
  }
}

class JornadaRepository {
  constructor(sequelizeModel) {
    this.model = sequelizeModel;
  }

  async findById(id) {
    return this.model.findByPk(id, {
      include: ['usuario', 'vehiculo']
    });
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, estado, sort = 'id', order = 'ASC' } = options;
    const offset = (page - 1) * limit;
    const where = estado ? { estado } : {};

    const { count, rows } = await this.model.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort, order]],
      include: ['usuario', 'vehiculo']
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    await this.model.update(data, { where: { id } });
    return this.findById(id);
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }

  async findActiveByUsuario(usuarioId) {
    return this.model.findAll({
      where: { usuario_id: usuarioId, estado: 'activa' },
      include: ['vehiculo']
    });
  }
}

class RoleRepository {
  constructor(sequelizeModel) {
    this.model = sequelizeModel;
  }

  async findById(id) {
    return this.model.findByPk(id);
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC' } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.model.findAndCountAll({
      limit,
      offset,
      order: [[sort, order]]
    });

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    await this.model.update(data, { where: { id } });
    return this.findById(id);
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }

  async findByName(nombre) {
    return this.model.findOne({ where: { nombre } });
  }
}

module.exports = {
  UsuarioRepository,
  VehiculoRepository,
  JornadaRepository,
  RoleRepository
};
