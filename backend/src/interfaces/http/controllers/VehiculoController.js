// Interfaces - Vehiculo Controller

const { CreateVehiculoDTO, UpdateVehiculoDTO } = require('../../../application/dtos/vehiculo.dto.js');
const { Usuario } = require('../../../infrastructure/persistence');

class VehiculoController {
  constructor(diContainer) {
    this.diContainer = diContainer;
  }

  async create(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.user.id);
      const createVehiculoDTO = CreateVehiculoDTO.fromRequest({
        ...req.body,
        empresa_id: usuario?.empresa_id || null
      });
      const useCase = this.diContainer.get('CreateVehiculoUseCase');
      const vehiculo = await useCase.execute(createVehiculoDTO);

      res.status(201).json({
        success: true,
        data: vehiculo,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, tipo, activo, unidad_nro } = req.query;
      const filters = {};
      const usuario = await Usuario.findByPk(req.user.id);
      if (usuario?.empresa_id) filters.empresa_id = usuario.empresa_id;
      if (tipo) filters.tipo = tipo;
      if (activo !== undefined) filters.activo = activo === 'true' || activo === true;
      if (unidad_nro) filters.unidad_nro = unidad_nro;

      const useCase = this.diContainer.get('GetAllVehiculosUseCase');
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
      const useCase = this.diContainer.get('GetVehiculoByIdUseCase');
      const vehiculo = await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        data: vehiculo,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateVehiculoDTO = UpdateVehiculoDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('UpdateVehiculoUseCase');
      const vehiculo = await useCase.execute(parseInt(id), updateVehiculoDTO);

      res.status(200).json({
        success: true,
        data: vehiculo,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = this.diContainer.get('DeleteVehiculoUseCase');
      await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Vehículo eliminado exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VehiculoController;
