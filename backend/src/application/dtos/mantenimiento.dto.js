// Application - MantenimientoVidaUtil DTOs

const { ValidationException } = require('../../domain/exceptions');

class CreateMantenimientoDTO {
  constructor(vehiculo_id, tipo_servicio, observaciones, fecha_servicio, horometro_servicio, costo_total, foto_factura_url) {
    this.vehiculo_id = parseInt(vehiculo_id);
    this.tipo_servicio = tipo_servicio?.trim();
    this.observaciones = observaciones?.trim() || null;
    this.fecha_servicio = new Date(fecha_servicio);
    this.horometro_servicio = parseFloat(horometro_servicio);
    this.costo_total = parseFloat(costo_total);
    this.foto_factura_url = foto_factura_url?.trim() || null;
  }

  validate() {
    const errors = [];

    if (!Number.isInteger(this.vehiculo_id) || this.vehiculo_id < 1) {
      errors.push('vehiculo_id debe ser un numero entero valido');
    }

    if (!this.tipo_servicio || this.tipo_servicio.length < 2) {
      errors.push('tipo_servicio debe tener al menos 2 caracteres');
    }

    if (this.observaciones !== null && this.observaciones.length < 3) {
      errors.push('observaciones debe tener al menos 3 caracteres');
    }

    if (isNaN(this.fecha_servicio.getTime())) {
      errors.push('fecha_servicio debe ser una fecha valida');
    }

    if (isNaN(this.horometro_servicio) || this.horometro_servicio < 0) {
      errors.push('horometro_servicio debe ser un numero positivo');
    }

    if (isNaN(this.costo_total) || this.costo_total <= 0) {
      errors.push('costo_total debe ser un numero positivo');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new CreateMantenimientoDTO(
      body.vehiculo_id,
      body.tipo_servicio || body.tipo_mantenimiento,
      body.observaciones || body.descripcion,
      body.fecha_servicio || body.fecha_inicio,
      body.horometro_servicio || body.horometro_realizado,
      body.costo_total || body.costo,
      body.foto_factura_url
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

class UpdateMantenimientoDTO {
  constructor(tipo_servicio, observaciones, fecha_servicio, horometro_servicio, proximo_mantenimiento_h, costo_total, foto_factura_url) {
    this.tipo_servicio = tipo_servicio ? tipo_servicio.trim() : null;
    this.observaciones = observaciones ? observaciones.trim() : null;
    this.fecha_servicio = fecha_servicio ? new Date(fecha_servicio) : null;
    this.horometro_servicio = horometro_servicio ? parseFloat(horometro_servicio) : null;
    this.proximo_mantenimiento_h = proximo_mantenimiento_h ? parseFloat(proximo_mantenimiento_h) : null;
    this.costo_total = costo_total ? parseFloat(costo_total) : null;
    this.foto_factura_url = foto_factura_url ? foto_factura_url.trim() : null;
  }

  validate() {
    const errors = [];

    if (this.tipo_servicio !== null && this.tipo_servicio.length < 2) {
      errors.push('tipo_servicio debe tener al menos 2 caracteres');
    }

    if (this.observaciones !== null && this.observaciones.length < 3) {
      errors.push('observaciones debe tener al menos 3 caracteres');
    }

    if (this.fecha_servicio !== null && isNaN(this.fecha_servicio.getTime())) {
      errors.push('fecha_servicio debe ser una fecha valida');
    }

    if (this.horometro_servicio !== null && (isNaN(this.horometro_servicio) || this.horometro_servicio < 0)) {
      errors.push('horometro_servicio debe ser un numero positivo');
    }

    if (this.proximo_mantenimiento_h !== null && (isNaN(this.proximo_mantenimiento_h) || this.proximo_mantenimiento_h < 0)) {
      errors.push('proximo_mantenimiento_h debe ser un numero positivo');
    }

    if (this.costo_total !== null && (isNaN(this.costo_total) || this.costo_total <= 0)) {
      errors.push('costo_total debe ser un numero positivo');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new UpdateMantenimientoDTO(
      body.tipo_servicio || body.tipo_mantenimiento,
      body.observaciones || body.descripcion,
      body.fecha_servicio || body.fecha_inicio,
      body.horometro_servicio || body.horometro_realizado,
      body.proximo_mantenimiento_h,
      body.costo_total || body.costo,
      body.foto_factura_url
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

module.exports = {
  CreateMantenimientoDTO,
  UpdateMantenimientoDTO
};
