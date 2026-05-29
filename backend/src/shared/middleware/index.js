// Shared middleware for HTTP layer

const { UnauthorizedException, ForbiddenException, DomainException } = require('../../domain/exceptions');
const { logger } = require('../utils');
const { validateDTO, validateIdParam } = require('./validation');
const container = require('../../container');

/**
 * Middleware de autenticación JWT
 * Verifica el token en el header Authorization: Bearer <token>
 * Valida que el token no esté en la blacklist (logout)
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(7);
    const authService = container.get('authService');
    const decoded = await authService.verifyToken(token);
    
    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Verificar que el token no esté en blacklist (puede ser async)
    const isBlacklisted = await authService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been revoked - please login again');
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de autorización por rol
 * Verifica que el usuario tenga los roles requeridos
 */
const authorizationMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedException('User not authenticated');
      }

      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      if (!roles.includes(req.user.rol_id)) {
        throw new ForbiddenException('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


const errorMiddleware = (err, req, res, next) => {
  // Default error values
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let debugMessage = null; // Para logging en desarrollo

  // Handle domain exceptions (seguro exponer estos mensajes)
  if (err instanceof DomainException) {
    statusCode = err.statusCode || 500;
    code = err.code || 'DOMAIN_ERROR';
    message = err.message; // Los DomainExceptions son seguros (lanzados por la app)
  } 
  // Handle standard Error (potencialmente inseguro)
  else if (err instanceof Error) {
    code = 'ERROR';
    // En desarrollo, loguear el mensaje completo pero no enviarlo al cliente
    if (process.env.NODE_ENV === 'development') {
      debugMessage = err.message;
      message = err.message; // Solo en desarrollo
    }
    // En producción, mensaje genérico
  }

  // Log the error con información completa para debugging
  logger.error(`[${req.method} ${req.path}] ${code}`, {
    message: err.message,
    stack: err.stack,
    debugMessage,
    statusCode
  });

  // Send response (nunca exponer stack traces o detalles internos)
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message // En producción: genérico. En desarrollo: completo si es DomainException
    },
    timestamp: new Date().toISOString()
    // NO incluir stack, file paths, database details, etc.
  });
};

module.exports = {
  authMiddleware,
  authorizationMiddleware,
  errorMiddleware,
  validateDTO,
  validateIdParam
};
