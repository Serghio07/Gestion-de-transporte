// Application - ChecklistDiario DTOs

const { ValidationException } = require('../../domain/exceptions');

class CreateChecklistDTO {
  constructor(jornada_id, llantas_ok, luces_ok, frenos_ok, niveles_ok, comentarios) {
    this.jornada_id = parseInt(jornada_id);
    this.llantas_ok = Boolean(llantas_ok);
    this.luces_ok = Boolean(luces_ok);
    this.frenos_ok = Boolean(frenos_ok);
    this.niveles_ok = Boolean(niveles_ok);
    this.comentarios = comentarios ? comentarios.trim() : null;
  }

  validate() {
    const errors = [];

    if (!Number.isInteger(this.jornada_id) || this.jornada_id < 1) {
      errors.push('jornada_id debe ser un número entero válido');
    }

    if (typeof this.llantas_ok !== 'boolean') {
      errors.push('llantas_ok debe ser booleano');
    }

    if (typeof this.luces_ok !== 'boolean') {
      errors.push('luces_ok debe ser booleano');
    }

    if (typeof this.frenos_ok !== 'boolean') {
      errors.push('frenos_ok debe ser booleano');
    }

    if (typeof this.niveles_ok !== 'boolean') {
      errors.push('niveles_ok debe ser booleano');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new CreateChecklistDTO(
      body.jornada_id,
      body.llantas_ok,
      body.luces_ok,
      body.frenos_ok,
      body.niveles_ok,
      body.comentarios
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

class UpdateChecklistDTO {
  constructor(llantas_ok, luces_ok, frenos_ok, niveles_ok, comentarios) {
    this.llantas_ok = llantas_ok === undefined || llantas_ok === null ? null : Boolean(llantas_ok);
    this.luces_ok = luces_ok === undefined || luces_ok === null ? null : Boolean(luces_ok);
    this.frenos_ok = frenos_ok === undefined || frenos_ok === null ? null : Boolean(frenos_ok);
    this.niveles_ok = niveles_ok === undefined || niveles_ok === null ? null : Boolean(niveles_ok);
    this.comentarios = comentarios ? comentarios.trim() : null;
  }

  validate() {
    const errors = [];

    if (this.llantas_ok !== null && typeof this.llantas_ok !== 'boolean') {
      errors.push('llantas_ok debe ser booleano');
    }

    if (this.luces_ok !== null && typeof this.luces_ok !== 'boolean') {
      errors.push('luces_ok debe ser booleano');
    }

    if (this.frenos_ok !== null && typeof this.frenos_ok !== 'boolean') {
      errors.push('frenos_ok debe ser booleano');
    }

    if (this.niveles_ok !== null && typeof this.niveles_ok !== 'boolean') {
      errors.push('niveles_ok debe ser booleano');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new UpdateChecklistDTO(
      body.llantas_ok,
      body.luces_ok,
      body.frenos_ok,
      body.niveles_ok,
      body.comentarios
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

module.exports = {
  CreateChecklistDTO,
  UpdateChecklistDTO
};
