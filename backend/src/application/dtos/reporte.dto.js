// Application - ReporteAveria DTOs

const { ValidationException } = require('../../domain/exceptions');

class CreateReporteDTO {
  constructor(nombre_archivo, tipo_reporte, fecha_desde, fecha_hasta, generado_por_id, url_descarga, resumen_json) {
    this.nombre_archivo = nombre_archivo?.trim();
    this.tipo_reporte = tipo_reporte?.trim() || null;
    this.fecha_desde = fecha_desde ? new Date(fecha_desde) : null;
    this.fecha_hasta = fecha_hasta ? new Date(fecha_hasta) : null;
    this.generado_por_id = generado_por_id ? parseInt(generado_por_id) : null;
    this.url_descarga = url_descarga?.trim() || null;
    this.resumen_json = resumen_json ?? null;
  }

  validate() {
    const errors = [];

    if (!this.nombre_archivo || this.nombre_archivo.length < 3) {
      errors.push('nombre_archivo debe tener al menos 3 caracteres');
    }

    if (!this.fecha_desde || isNaN(this.fecha_desde.getTime())) {
      errors.push('fecha_desde debe ser una fecha válida');
    }

    if (!this.fecha_hasta || isNaN(this.fecha_hasta.getTime())) {
      errors.push('fecha_hasta debe ser una fecha válida');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new CreateReporteDTO(
      body.nombre_archivo,
      body.tipo_reporte,
      body.fecha_desde,
      body.fecha_hasta,
      body.generado_por_id,
      body.url_descarga,
      body.resumen_json
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

class UpdateReporteDTO {
  constructor(nombre_archivo, tipo_reporte, fecha_desde, fecha_hasta, url_descarga, resumen_json) {
    this.nombre_archivo = nombre_archivo ? nombre_archivo.trim() : null;
    this.tipo_reporte = tipo_reporte ? tipo_reporte.trim() : null;
    this.fecha_desde = fecha_desde ? new Date(fecha_desde) : null;
    this.fecha_hasta = fecha_hasta ? new Date(fecha_hasta) : null;
    this.url_descarga = url_descarga ? url_descarga.trim() : null;
    this.resumen_json = resumen_json ?? null;
  }

  validate() {
    const errors = [];

    if (this.nombre_archivo !== null && this.nombre_archivo.length < 3) {
      errors.push('nombre_archivo debe tener al menos 3 caracteres');
    }

    if (this.fecha_desde !== null && isNaN(this.fecha_desde.getTime())) {
      errors.push('fecha_desde debe ser una fecha válida');
    }

    if (this.fecha_hasta !== null && isNaN(this.fecha_hasta.getTime())) {
      errors.push('fecha_hasta debe ser una fecha válida');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new UpdateReporteDTO(
      body.nombre_archivo,
      body.tipo_reporte,
      body.fecha_desde,
      body.fecha_hasta,
      body.url_descarga,
      body.resumen_json
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

module.exports = {
  CreateReporteDTO,
  UpdateReporteDTO
};
