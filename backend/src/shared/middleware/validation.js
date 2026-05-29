// Shared - DTO Validation Middleware

const { ValidationException } = require('../../domain/exceptions');
const { logger } = require('../utils');

/**
 * Middleware que valida DTOs en las rutas
 * Uso: validateDTO(CreateUsuarioDTO)
 */
function validateDTO(DTOClass) {
  return (req, res, next) => {
    try {
      const dto = DTOClass.fromRequest(req.body);
      req.validatedDTO = dto;
      next();
    } catch (error) {
      if (error instanceof ValidationException) {
        logger.warn(`Validation error: ${error.message}`);
        return res.status(422).json({
          success: false,
          error: 'Validation failed',
          message: error.message,
          code: 'VALIDATION_ERROR'
        });
      }
      next(error);
    }
  };
}

/**
 * Middleware que valida parámetros ID
 */
function validateIdParam() {
  return (req, res, next) => {
    const { id } = req.params;
    const idNum = parseInt(id);

    if (isNaN(idNum) || idNum < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID parameter',
        message: 'ID must be a positive integer',
        code: 'INVALID_ID'
      });
    }

    req.params.id = idNum;
    next();
  };
}

module.exports = {
  validateDTO,
  validateIdParam
};
