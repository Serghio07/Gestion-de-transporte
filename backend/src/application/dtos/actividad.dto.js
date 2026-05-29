// Application - ActividadGasto DTOs

const { ValidationException } = require('../../domain/exceptions');

class CreateActividadDTO {
  constructor(jornada_id, tipo_actividad, monto_gastado, cantidad_unidades, proveedor_lugar, foto_comprobante_url, fecha_registro) {
    this.jornada_id = parseInt(jornada_id);
    this.tipo_actividad = tipo_actividad?.trim()?.toLowerCase();
    this.monto_gastado = parseFloat(monto_gastado);
    this.cantidad_unidades = cantidad_unidades !== undefined && cantidad_unidades !== null ? parseFloat(cantidad_unidades) : null;
    this.proveedor_lugar = proveedor_lugar?.trim() || null;
    this.foto_comprobante_url = foto_comprobante_url?.trim() || null;
    this.fecha_registro = fecha_registro ? new Date(fecha_registro) : new Date();
  }

  validate() {
    const errors = [];

    if (!Number.isInteger(this.jornada_id) || this.jornada_id < 1) {
      errors.push('jornada_id debe ser un número entero válido');
    }

    if (!this.tipo_actividad || this.tipo_actividad.length < 3) {
      errors.push('tipo_actividad debe tener al menos 3 caracteres');
    }

    if (isNaN(this.monto_gastado) || this.monto_gastado <= 0) {
      errors.push('monto_gastado debe ser un número positivo');
    }

    if (this.cantidad_unidades !== null && (isNaN(this.cantidad_unidades) || this.cantidad_unidades < 0)) {
      errors.push('cantidad_unidades debe ser un número válido');
    }

    if (isNaN(this.fecha_registro.getTime())) {
      errors.push('fecha_registro debe ser una fecha válida');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new CreateActividadDTO(
      body.jornada_id,
      body.tipo_actividad,
      body.monto_gastado,
      body.cantidad_unidades,
      body.proveedor_lugar,
      body.foto_comprobante_url,
      body.fecha_registro
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

class UpdateActividadDTO {
  constructor(tipo_actividad, monto_gastado, cantidad_unidades, proveedor_lugar, foto_comprobante_url) {
    this.tipo_actividad = tipo_actividad ? tipo_actividad.trim().toLowerCase() : null;
    this.monto_gastado = monto_gastado !== undefined && monto_gastado !== null ? parseFloat(monto_gastado) : null;
    this.cantidad_unidades = cantidad_unidades !== undefined && cantidad_unidades !== null ? parseFloat(cantidad_unidades) : null;
    this.proveedor_lugar = proveedor_lugar ? proveedor_lugar.trim() : null;
    this.foto_comprobante_url = foto_comprobante_url ? foto_comprobante_url.trim() : null;
  }

  validate() {
    const errors = [];

    if (this.tipo_actividad !== null && this.tipo_actividad.length < 3) {
      errors.push('tipo_actividad debe tener al menos 3 caracteres');
    }

    if (this.monto_gastado !== null && (isNaN(this.monto_gastado) || this.monto_gastado <= 0)) {
      errors.push('monto_gastado debe ser un número positivo');
    }

    if (this.cantidad_unidades !== null && (isNaN(this.cantidad_unidades) || this.cantidad_unidades < 0)) {
      errors.push('cantidad_unidades debe ser un número válido');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new UpdateActividadDTO(
      body.tipo_actividad,
      body.monto_gastado,
      body.cantidad_unidades,
      body.proveedor_lugar,
      body.foto_comprobante_url
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

module.exports = {
  CreateActividadDTO,
  UpdateActividadDTO
};
