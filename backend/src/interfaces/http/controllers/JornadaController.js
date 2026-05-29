// Interfaces - Jornada Controller

const { CreateJornadaDTO, UpdateJornadaDTO } = require('../../../application/dtos/jornada.dto.js');

class JornadaController {
  constructor(diContainer) {
    this.diContainer = diContainer;
  }

  async create(req, res, next) {
    try {
      const createJornadaDTO = CreateJornadaDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('CreateJornadaUseCase');
      const jornada = await useCase.execute(createJornadaDTO);

      res.status(201).json({
        success: true,
        data: jornada,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, estado, usuario_id, vehiculo_id } = req.query;
      const filters = {};
      if (estado) filters.estado = estado;
      if (usuario_id) filters.usuario_id = parseInt(usuario_id);
      if (vehiculo_id) filters.vehiculo_id = parseInt(vehiculo_id);

      const useCase = this.diContainer.get('GetAllJornadasUseCase');
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
      const useCase = this.diContainer.get('GetJornadaByIdUseCase');
      const jornada = await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        data: jornada,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateJornadaDTO = UpdateJornadaDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('UpdateJornadaUseCase');
      const jornada = await useCase.execute(parseInt(id), updateJornadaDTO);

      res.status(200).json({
        success: true,
        data: jornada,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = this.diContainer.get('DeleteJornadaUseCase');
      await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Jornada eliminada exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = JornadaController;
