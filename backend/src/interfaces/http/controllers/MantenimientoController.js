// Interfaces - Mantenimiento Controller

const { CreateMantenimientoDTO, UpdateMantenimientoDTO } = require('../../../application/dtos/mantenimiento.dto.js');
const { Usuario } = require('../../../infrastructure/persistence');

class MantenimientoController {
  constructor(diContainer) {
    this.diContainer = diContainer;
  }

  async create(req, res, next) {
    try {
      const createMantenimientoDTO = CreateMantenimientoDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('CreateMantenimientoUseCase');
      const mantenimiento = await useCase.execute(createMantenimientoDTO);

      res.status(201).json({
        success: true,
        data: mantenimiento,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, vehiculo_id, tipo_servicio, tipo_mantenimiento } = req.query;
      const filters = {};
      const usuario = await Usuario.findByPk(req.user.id);
      if (usuario?.empresa_id) filters.empresa_id = usuario.empresa_id;
      if (vehiculo_id) filters.vehiculo_id = parseInt(vehiculo_id);
      if (tipo_servicio) filters.tipo_servicio = tipo_servicio;
      if (tipo_mantenimiento) filters.tipo_mantenimiento = tipo_mantenimiento;

      const useCase = this.diContainer.get('GetAllMantenimientosUseCase');
      const result = await useCase.execute(filters, { page: parseInt(page), limit: parseInt(limit) });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: { ...result.pagination, hasMore: result.pagination.page < result.pagination.pages },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = this.diContainer.get('GetMantenimientoByIdUseCase');
      const mantenimiento = await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        data: mantenimiento,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateMantenimientoDTO = UpdateMantenimientoDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('UpdateMantenimientoUseCase');
      const mantenimiento = await useCase.execute(parseInt(id), updateMantenimientoDTO);

      res.status(200).json({
        success: true,
        data: mantenimiento,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = this.diContainer.get('DeleteMantenimientoUseCase');
      await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Mantenimiento eliminado exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MantenimientoController;
