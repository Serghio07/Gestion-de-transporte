// Domain entities - Entidades del dominio sin lógica de persistencia

class Usuario {
  constructor(id, nombre_usuario, email, password, nombre_completo, rol_id, activo = true) {
    this.id = id;
    this.nombre_usuario = nombre_usuario;
    this.email = email;
    this.password = password;
    this.nombre_completo = nombre_completo;
    this.rol_id = rol_id;
    this.activo = activo;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(nombre_usuario, email, password, nombre_completo, rol_id) {
    return new Usuario(null, nombre_usuario, email, password, nombre_completo, rol_id);
  }

  isActive() {
    return this.activo === true;
  }

  deactivate() {
    this.activo = false;
  }

  activate() {
    this.activo = true;
  }
}

class Vehiculo {
  constructor(id, placa, marca, modelo, anio, activo = true) {
    this.id = id;
    this.placa = placa;
    this.marca = marca;
    this.modelo = modelo;
    this.anio = anio;
    this.activo = activo;
    this.combustible_actual = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(placa, marca, modelo, anio) {
    return new Vehiculo(null, placa, marca, modelo, anio);
  }

  isOperational() {
    return this.activo === true;
  }

  updateFuel(amount) {
    if (amount < 0 || amount > 100) {
      throw new Error('Fuel must be between 0 and 100');
    }
    this.combustible_actual = amount;
  }
}

class Jornada {
  constructor(id, usuario_id, vehiculo_id, fecha_inicio, hora_inicio) {
    this.id = id;
    this.usuario_id = usuario_id;
    this.vehiculo_id = vehiculo_id;
    this.fecha_inicio = fecha_inicio;
    this.hora_inicio = hora_inicio;
    this.estado = 'activa';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(usuario_id, vehiculo_id, fecha_inicio, hora_inicio) {
    return new Jornada(null, usuario_id, vehiculo_id, fecha_inicio, hora_inicio);
  }

  close(fecha_cierre, hora_cierre) {
    this.fecha_cierre = fecha_cierre;
    this.hora_cierre = hora_cierre;
    this.estado = 'cerrada';
  }

  cancel() {
    this.estado = 'cancelada';
  }

  isActive() {
    return this.estado === 'activa';
  }
}

class Role {
  constructor(id, nombre, descripcion) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static create(nombre, descripcion) {
    return new Role(null, nombre, descripcion);
  }
}

module.exports = {
  Usuario,
  Vehiculo,
  Jornada,
  Role
};
