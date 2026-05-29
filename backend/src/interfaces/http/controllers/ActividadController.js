// Interfaces - Actividad Controller

const { CreateActividadDTO, UpdateActividadDTO } = require('../../../application/dtos/actividad.dto.js');

class ActividadController {
  constructor(diContainer) {
    this.diContainer = diContainer;
  }

  async create(req, res, next) {
    try {
      const createActividadDTO = CreateActividadDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('CreateActividadUseCase');
      const actividad = await useCase.execute(createActividadDTO);

      res.status(201).json({
        success: true,
        data: actividad,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, jornada_id, tipo_actividad } = req.query;
      const filters = {};
      if (jornada_id) filters.jornada_id = parseInt(jornada_id);
      if (tipo_actividad) filters.tipo_actividad = tipo_actividad;

      const useCase = this.diContainer.get('GetAllActividadesUseCase');
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
      const useCase = this.diContainer.get('GetActividadByIdUseCase');
      const actividad = await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        data: actividad,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateActividadDTO = UpdateActividadDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('UpdateActividadUseCase');
      const actividad = await useCase.execute(parseInt(id), updateActividadDTO);

      res.status(200).json({
        success: true,
        data: actividad,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = this.diContainer.get('DeleteActividadUseCase');
      await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Actividad eliminada exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActividadController;
