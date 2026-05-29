// Interfaces - Reporte Controller

const { CreateReporteDTO, UpdateReporteDTO } = require('../../../application/dtos/reporte.dto.js');

class ReporteController {
  constructor(diContainer) {
    this.diContainer = diContainer;
  }

  async create(req, res, next) {
    try {
      const createReporteDTO = CreateReporteDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('CreateReporteUseCase');
      const reporte = await useCase.execute(createReporteDTO);

      res.status(201).json({
        success: true,
        data: reporte,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, tipo_reporte, generado_por_id } = req.query;
      const filters = {};
      if (tipo_reporte) filters.tipo_reporte = tipo_reporte;
      if (generado_por_id) filters.generado_por_id = parseInt(generado_por_id);

      const useCase = this.diContainer.get('GetAllReportesUseCase');
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
      const useCase = this.diContainer.get('GetReporteByIdUseCase');
      const reporte = await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        data: reporte,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateReporteDTO = UpdateReporteDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('UpdateReporteUseCase');
      const reporte = await useCase.execute(parseInt(id), updateReporteDTO);

      res.status(200).json({
        success: true,
        data: reporte,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = this.diContainer.get('DeleteReporteUseCase');
      await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Reporte eliminado exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReporteController;
