const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

// Importar modelos
const Role = require('./Role')(sequelize);
const Empresa = require('./Empresa')(sequelize);
const Usuario = require('./Usuario')(sequelize);
const Vehiculo = require('./Vehiculo')(sequelize);
const Jornada = require('./Jornada')(sequelize);
const ChecklistDiario = require('./ChecklistDiario')(sequelize);
const ActividadGasto = require('./ActividadGasto')(sequelize);
const ReportePdf = require('./ReportePdf')(sequelize);
const MantenimientoVidaUtil = require('./MantenimientoVidaUtil')(sequelize);
const Session = require('./Session')(sequelize);
const Anticipo = require('./Anticipo')(sequelize);
const AlertaMantenimiento = require('./AlertaMantenimiento')(sequelize);
const HistorialCambio = require('./HistorialCambio')(sequelize);
const TokenBlacklist = require('./TokenBlacklist')(sequelize);
const TelefonoVerificacion = require('./TelefonoVerificacion')(sequelize);

// Definir relaciones
Empresa.hasMany(Usuario, { foreignKey: 'empresa_id', as: 'usuarios' });
Usuario.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

Role.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });
Usuario.belongsTo(Role, { foreignKey: 'rol_id', as: 'role' });

Usuario.hasMany(Empresa, { foreignKey: 'creado_por_id', as: 'empresas_creadas' });
Empresa.belongsTo(Usuario, { foreignKey: 'creado_por_id', as: 'creado_por' });

Usuario.hasMany(Jornada, { foreignKey: 'usuario_id', as: 'jornadas' });
Jornada.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Vehiculo.hasMany(Jornada, { foreignKey: 'vehiculo_id', as: 'jornadas' });
Jornada.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

Jornada.hasOne(ChecklistDiario, { foreignKey: 'jornada_id', as: 'checklist' });
ChecklistDiario.belongsTo(Jornada, { foreignKey: 'jornada_id', as: 'jornada' });

Jornada.hasMany(ActividadGasto, { foreignKey: 'jornada_id', as: 'actividades' });
ActividadGasto.belongsTo(Jornada, { foreignKey: 'jornada_id', as: 'jornada' });

Usuario.hasMany(ReportePdf, { foreignKey: 'generado_por_id', as: 'reportes_generados' });
ReportePdf.belongsTo(Usuario, { foreignKey: 'generado_por_id', as: 'generado_por' });

Vehiculo.hasMany(MantenimientoVidaUtil, { foreignKey: 'vehiculo_id', as: 'mantenimientos' });
MantenimientoVidaUtil.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

Usuario.hasMany(Session, { foreignKey: 'usuario_id', as: 'sesiones_activas' });
Session.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(TelefonoVerificacion, { foreignKey: 'usuario_id', as: 'telefono_verificaciones' });
TelefonoVerificacion.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Jornada.hasMany(Anticipo, { foreignKey: 'jornada_id', as: 'anticipos' });
Anticipo.belongsTo(Jornada, { foreignKey: 'jornada_id', as: 'jornada' });
Usuario.hasMany(Anticipo, { foreignKey: 'entregado_por', as: 'anticipos_entregados' });
Anticipo.belongsTo(Usuario, { foreignKey: 'entregado_por', as: 'entregado_por_usuario' });

Vehiculo.hasMany(AlertaMantenimiento, { foreignKey: 'vehiculo_id', as: 'alertas_mantenimiento' });
AlertaMantenimiento.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });
Usuario.hasMany(AlertaMantenimiento, { foreignKey: 'resuelta_por_id', as: 'alertas_resueltas' });
AlertaMantenimiento.belongsTo(Usuario, { foreignKey: 'resuelta_por_id', as: 'resuelta_por' });

// Token Blacklist
Usuario.hasMany(TokenBlacklist, { foreignKey: 'usuario_id', as: 'tokens_revocados' });
TokenBlacklist.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

module.exports = {
  sequelize,
  Role,
  Empresa,
  Usuario,
  Vehiculo,
  Jornada,
  ChecklistDiario,
  ActividadGasto,
  ReportePdf,
  MantenimientoVidaUtil,
  Session,
  Anticipo,
  AlertaMantenimiento,
  HistorialCambio,
  TokenBlacklist,
  TelefonoVerificacion
};
