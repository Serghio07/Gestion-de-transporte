// Application - Usuario DTOs

const { ValidationException } = require('../../domain/exceptions');

function normalizePhone(value) {
  return String(value || '').trim().replace(/[^\d+]/g, '') || null;
}

class CreateUsuarioDTO {
  constructor(nombre, apellido, email, telefono, empresa_id, password, rol_id, estado) {
    this.nombre = nombre?.trim();
    this.apellido = apellido?.trim() || null;
    this.email = email?.trim()?.toLowerCase() || null;
    this.telefono = normalizePhone(telefono);
    this.empresa_id = empresa_id ? parseInt(empresa_id) : null;
    this.password = password;
    this.rol_id = parseInt(rol_id);
    this.estado = estado?.toLowerCase() || 'activo';
  }

  validate() {
    const errors = [];

    if (!this.nombre || this.nombre.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!this.telefono || this.telefono.length < 6) {
      errors.push('El telefono es requerido');
    }

    if (!this.password || this.password.length < 8) {
      errors.push('La contrasena debe tener al menos 8 caracteres');
    }

    if (!Number.isInteger(this.rol_id) || this.rol_id < 1) {
      errors.push('El rol_id debe ser un numero entero valido');
    }

    if (!['activo', 'inactivo'].includes(this.estado)) {
      errors.push('El estado debe ser activo o inactivo');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new CreateUsuarioDTO(
      body.nombre,
      body.apellido,
      body.email,
      body.telefono,
      body.empresa_id,
      body.password,
      body.rol_id,
      body.estado
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

class UpdateUsuarioDTO {
  constructor(nombre, email, telefono, password, rol_id, estado) {
    this.nombre = nombre ? nombre.trim() : null;
    this.email = email ? email.trim().toLowerCase() : null;
    this.telefono = telefono ? normalizePhone(telefono) : null;
    this.password = password || null;
    this.rol_id = rol_id ? parseInt(rol_id) : null;
    this.estado = estado ? estado.toLowerCase() : null;
  }

  validate() {
    const errors = [];

    if (this.nombre !== null && this.nombre.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (this.telefono !== null && this.telefono.length < 6) {
      errors.push('El telefono no es valido');
    }

    if (this.password !== null && this.password.length < 8) {
      errors.push('La contrasena debe tener al menos 8 caracteres');
    }

    if (this.rol_id !== null && (!Number.isInteger(this.rol_id) || this.rol_id < 1)) {
      errors.push('El rol_id debe ser un numero entero valido');
    }

    if (this.estado !== null && !['activo', 'inactivo'].includes(this.estado)) {
      errors.push('El estado debe ser activo o inactivo');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new UpdateUsuarioDTO(
      body.nombre,
      body.email,
      body.telefono,
      body.password,
      body.rol_id,
      body.estado
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

module.exports = {
  CreateUsuarioDTO,
  UpdateUsuarioDTO
};
