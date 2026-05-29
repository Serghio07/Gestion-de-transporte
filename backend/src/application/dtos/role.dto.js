// Application - Role DTOs

const { ValidationException } = require('../../domain/exceptions');

const VALID_PERMISSIONS = [
  'usuarios.crear',
  'usuarios.leer',
  'usuarios.actualizar',
  'usuarios.eliminar',
  'vehiculos.crear',
  'vehiculos.leer',
  'vehiculos.actualizar',
  'vehiculos.eliminar',
  'jornadas.crear',
  'jornadas.leer',
  'jornadas.actualizar',
  'jornadas.eliminar',
  'checklists.crear',
  'checklists.leer',
  'checklists.actualizar',
  'checklists.eliminar',
  'actividades.crear',
  'actividades.leer',
  'actividades.actualizar',
  'actividades.eliminar',
  'mantenimientos.crear',
  'mantenimientos.leer',
  'mantenimientos.actualizar',
  'mantenimientos.eliminar',
  'reportes.crear',
  'reportes.leer',
  'reportes.actualizar',
  'reportes.eliminar',
  'roles.crear',
  'roles.leer',
  'roles.actualizar',
  'roles.eliminar'
];

class CreateRoleDTO {
  constructor(nombre, descripcion, permisos) {
    this.nombre = nombre?.trim()?.toLowerCase();
    this.descripcion = descripcion?.trim();
    this.permisos = Array.isArray(permisos) ? permisos : [];
  }

  validate() {
    const errors = [];

    if (!this.nombre || this.nombre.length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (!this.descripcion || this.descripcion.length < 5) {
      errors.push('La descripción debe tener al menos 5 caracteres');
    }

    if (!Array.isArray(this.permisos)) {
      errors.push('Los permisos deben ser un array');
    } else {
      const invalidPerms = this.permisos.filter(p => !VALID_PERMISSIONS.includes(p));
      if (invalidPerms.length > 0) {
        errors.push(`Permisos inválidos: ${invalidPerms.join(', ')}`);
      }
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new CreateRoleDTO(
      body.nombre,
      body.descripcion,
      body.permisos
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

class UpdateRoleDTO {
  constructor(nombre, descripcion, permisos) {
    this.nombre = nombre ? nombre.trim().toLowerCase() : null;
    this.descripcion = descripcion ? descripcion.trim() : null;
    this.permisos = Array.isArray(permisos) ? permisos : null;
  }

  validate() {
    const errors = [];

    if (this.nombre !== null && this.nombre.length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }

    if (this.descripcion !== null && this.descripcion.length < 5) {
      errors.push('La descripción debe tener al menos 5 caracteres');
    }

    if (this.permisos !== null) {
      if (!Array.isArray(this.permisos)) {
        errors.push('Los permisos deben ser un array');
      } else {
        const invalidPerms = this.permisos.filter(p => !VALID_PERMISSIONS.includes(p));
        if (invalidPerms.length > 0) {
          errors.push(`Permisos inválidos: ${invalidPerms.join(', ')}`);
        }
      }
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new UpdateRoleDTO(
      body.nombre,
      body.descripcion,
      body.permisos
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

module.exports = {
  CreateRoleDTO,
  UpdateRoleDTO,
  VALID_PERMISSIONS
};
