// Domain exceptions base
class DomainException extends Error {
  constructor(message, code = 'DOMAIN_ERROR') {
    super(message);
    this.name = 'DomainException';
    this.code = code;
    this.statusCode = 400;
  }
}

class ValidationException extends DomainException {
  constructor(message) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationException';
    this.statusCode = 422;
  }
}

class NotFoundException extends DomainException {
  constructor(resource, id) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND');
    this.name = 'NotFoundException';
    this.statusCode = 404;
  }
}

class UnauthorizedException extends DomainException {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedException';
    this.statusCode = 401;
  }
}

class ForbiddenException extends DomainException {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN');
    this.name = 'ForbiddenException';
    this.statusCode = 403;
  }
}

class ConflictException extends DomainException {
  constructor(message) {
    super(message, 'CONFLICT');
    this.name = 'ConflictException';
    this.statusCode = 409;
  }
}

module.exports = {
  DomainException,
  ValidationException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException
};
