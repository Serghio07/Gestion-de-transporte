// Application - Jornada DTOs

const { ValidationException } = require('../../domain/exceptions');

class CreateJornadaDTO {
  constructor(usuario_id, vehiculo_id, fecha_hora_inicio, capital_recibido, viaticos_entregados, saldo_rendido, gps_inicio, gps_final, observaciones, estado) {
    this.usuario_id = parseInt(usuario_id);
    this.vehiculo_id = parseInt(vehiculo_id);
    this.fecha_hora_inicio = fecha_hora_inicio ? new Date(fecha_hora_inicio) : new Date();
    this.capital_recibido = capital_recibido !== undefined ? parseFloat(capital_recibido) : 0;
    this.viaticos_entregados = viaticos_entregados !== undefined ? parseFloat(viaticos_entregados) : 0;
    this.saldo_rendido = saldo_rendido !== undefined && saldo_rendido !== null ? parseFloat(saldo_rendido) : null;
    this.gps_inicio = gps_inicio?.trim() || null;
    this.gps_final = gps_final?.trim() || null;
    this.observaciones = observaciones?.trim() || null;
    this.estado = estado?.toLowerCase() || 'activa';
  }

  validate() {
    const errors = [];

    if (!Number.isInteger(this.usuario_id) || this.usuario_id < 1) {
      errors.push('usuario_id debe ser un número entero válido');
    }

    if (!Number.isInteger(this.vehiculo_id) || this.vehiculo_id < 1) {
      errors.push('vehiculo_id debe ser un número entero válido');
    }

    if (isNaN(this.fecha_hora_inicio.getTime())) {
      errors.push('fecha_hora_inicio debe ser una fecha válida');
    }

    if (!['activa', 'cerrada', 'cancelada'].includes(this.estado)) {
      errors.push('El estado debe ser activa, cerrada o cancelada');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new CreateJornadaDTO(
      body.usuario_id,
      body.vehiculo_id,
      body.fecha_hora_inicio,
      body.capital_recibido,
      body.viaticos_entregados,
      body.saldo_rendido,
      body.gps_inicio,
      body.gps_final,
      body.observaciones,
      body.estado
    );
    const errors = dto.validate();
    if (errors) {
      throw new ValidationException(errors.join(', '));
    }
    return dto;
  }
}

class UpdateJornadaDTO {
  constructor(fecha_hora_cierre, duracion_jornada, capital_recibido, viaticos_entregados, saldo_rendido, gps_inicio, gps_final, observaciones, estado) {
    this.fecha_hora_cierre = fecha_hora_cierre ? new Date(fecha_hora_cierre) : null;
    this.duracion_jornada = duracion_jornada || null;
    this.capital_recibido = capital_recibido !== undefined && capital_recibido !== null ? parseFloat(capital_recibido) : null;
    this.viaticos_entregados = viaticos_entregados !== undefined && viaticos_entregados !== null ? parseFloat(viaticos_entregados) : null;
    this.saldo_rendido = saldo_rendido !== undefined && saldo_rendido !== null ? parseFloat(saldo_rendido) : null;
    this.gps_inicio = gps_inicio ? gps_inicio.trim() : null;
    this.gps_final = gps_final ? gps_final.trim() : null;
    this.observaciones = observaciones ? observaciones.trim() : null;
    this.estado = estado ? estado.toLowerCase() : null;
  }

  validate() {
    const errors = [];

    if (this.fecha_hora_cierre !== null && isNaN(this.fecha_hora_cierre.getTime())) {
      errors.push('fecha_hora_cierre debe ser una fecha válida');
    }

    if (this.estado !== null && !['activa', 'cerrada', 'cancelada'].includes(this.estado)) {
      errors.push('El estado debe ser activa, cerrada o cancelada');
    }

    return errors.length > 0 ? errors : null;
  }

  static fromRequest(body) {
    const dto = new UpdateJornadaDTO(
      body.fecha_hora_cierre,
      body.duracion_jornada,
      body.capital_recibido,
      body.viaticos_entregados,
      body.saldo_rendido,
      body.gps_inicio,
      body.gps_final,
      body.observaciones,
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
  CreateJornadaDTO,
  UpdateJornadaDTO
};
