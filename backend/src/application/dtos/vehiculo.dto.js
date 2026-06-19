// Application - Vehiculo DTOs

const { ValidationException } = require('../../domain/exceptions');

class CreateVehiculoDTO {
  constructor(unidad_nro, tipo, placa_serie, marca, modelo, activo, foto_url, empresa_id, conductor_id) {
    this.unidad_nro = unidad_nro?.trim();
    this.tipo = tipo?.trim()?.toLowerCase();
    this.placa_serie = placa_serie?.trim()?.toUpperCase() || null;
    this.marca = marca?.trim() || null;
    this.modelo = modelo?.trim() || null;
    this.activo = activo === undefined ? true : Boolean(activo);
    this.foto_url = foto_url?.trim() || null;
    this.empresa_id = empresa_id ? parseInt(empresa_id) : null;
    this.conductor_id = conductor_id ? parseInt(conductor_id) : null;
  }

  validate() {
    const errors = [];

    if (!this.unidad_nro || this.unidad_nro.length < 2) {
      errors.push('unidad_nro debe ser una cadena válida');
    }

    if (!this.tipo || this.tipo.length < 2) {
      errors.push('El tipo es requerido');
    }

    if (this.placa_serie !== null && this.placa_serie.length < 3) {
      errors.push('placa_serie debe tener al menos 3 caracteres');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new CreateVehiculoDTO(
      body.unidad_nro,
      body.tipo,
      body.placa_serie,
      body.marca,
      body.modelo,
      body.activo,
      body.foto_url,
      body.empresa_id,
      body.conductor_id
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

class UpdateVehiculoDTO {
  constructor(unidad_nro, tipo, placa_serie, marca, modelo, activo, uso_total_horas, foto_url, conductor_id) {
    this.unidad_nro = unidad_nro ? unidad_nro.trim() : null;
    this.tipo = tipo ? tipo.trim().toLowerCase() : null;
    this.placa_serie = placa_serie ? placa_serie.trim().toUpperCase() : null;
    this.marca = marca ? marca.trim() : null;
    this.modelo = modelo ? modelo.trim() : null;
    this.activo = activo === undefined || activo === null ? null : Boolean(activo);
    this.uso_total_horas = uso_total_horas || null;
    this.foto_url = foto_url ? foto_url.trim() : null;
    this.conductor_id = conductor_id ? parseInt(conductor_id) : null;
  }

  validate() {
    const errors = [];

    if (this.unidad_nro !== null && this.unidad_nro.length < 2) {
      errors.push('unidad_nro debe ser una cadena válida');
    }

    if (this.tipo !== null && this.tipo.length < 2) {
      errors.push('El tipo debe ser válido');
    }

    if (this.placa_serie !== null && this.placa_serie.length < 3) {
      errors.push('placa_serie debe tener al menos 3 caracteres');
    }

    if (this.marca !== null && this.marca.length < 2) {
      errors.push('La marca debe tener al menos 2 caracteres');
    }

    if (this.modelo !== null && this.modelo.length < 2) {
      errors.push('El modelo debe tener al menos 2 caracteres');
    }

    if (this.activo !== null && typeof this.activo !== 'boolean') {
      errors.push('activo debe ser booleano');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new UpdateVehiculoDTO(
      body.unidad_nro,
      body.tipo,
      body.placa_serie,
      body.marca,
      body.modelo,
      body.activo,
      body.uso_total_horas,
      body.foto_url,
      body.conductor_id
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

module.exports = {
  CreateVehiculoDTO,
  UpdateVehiculoDTO
};
