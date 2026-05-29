// Interfaces - Checklist Controller

const { CreateChecklistDTO, UpdateChecklistDTO } = require('../../../application/dtos/checklist.dto.js');

class ChecklistController {
  constructor(diContainer) {
    this.diContainer = diContainer;
  }

  async create(req, res, next) {
    try {
      const createChecklistDTO = CreateChecklistDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('CreateChecklistUseCase');
      const checklist = await useCase.execute(createChecklistDTO);

      res.status(201).json({
        success: true,
        data: checklist,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, jornada_id, llantas_ok } = req.query;
      const filters = {};
      if (jornada_id) filters.jornada_id = parseInt(jornada_id);
      if (llantas_ok !== undefined) filters.llantas_ok = llantas_ok === 'true' || llantas_ok === true;

      const useCase = this.diContainer.get('GetAllChecklistsUseCase');
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
      const useCase = this.diContainer.get('GetChecklistByIdUseCase');
      const checklist = await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        data: checklist,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateChecklistDTO = UpdateChecklistDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('UpdateChecklistUseCase');
      const checklist = await useCase.execute(parseInt(id), updateChecklistDTO);

      res.status(200).json({
        success: true,
        data: checklist,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = this.diContainer.get('DeleteChecklistUseCase');
      await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Checklist eliminado exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ChecklistController;
