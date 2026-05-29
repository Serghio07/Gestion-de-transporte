// Interfaces - Role Controller

const { CreateRoleDTO, UpdateRoleDTO } = require('../../../application/dtos/role.dto.js');

class RoleController {
  constructor(diContainer) {
    this.diContainer = diContainer;
  }

  async create(req, res, next) {
    try {
      const createRoleDTO = CreateRoleDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('CreateRoleUseCase');
      const role = await useCase.execute(createRoleDTO);

      res.status(201).json({
        success: true,
        data: role,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const useCase = this.diContainer.get('GetAllRolesUseCase');
      const result = await useCase.execute({ page: parseInt(page), limit: parseInt(limit) });

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
      const useCase = this.diContainer.get('GetRoleByIdUseCase');
      const role = await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        data: role,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const updateRoleDTO = UpdateRoleDTO.fromRequest(req.body);
      const useCase = this.diContainer.get('UpdateRoleUseCase');
      const role = await useCase.execute(parseInt(id), updateRoleDTO);

      res.status(200).json({
        success: true,
        data: role,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const useCase = this.diContainer.get('DeleteRoleUseCase');
      await useCase.execute(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Rol eliminado exitosamente',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoleController;
