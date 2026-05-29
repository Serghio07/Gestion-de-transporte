// Infrastructure persistence - Sequelize models mapping

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'gestion_transporte',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
  }
);

// Import models from old structure (they are factory functions)
const RoleFactory = require('../../models/Role');
const EmpresaFactory = require('../../models/Empresa');
const UsuarioFactory = require('../../models/Usuario');
const VehiculoFactory = require('../../models/Vehiculo');
const JornadaFactory = require('../../models/Jornada');
const ChecklistDiarioFactory = require('../../models/ChecklistDiario');
const ActividadGastoFactory = require('../../models/ActividadGasto');
const ReportePdfFactory = require('../../models/ReportePdf');
const MantenimientoVidaUtilFactory = require('../../models/MantenimientoVidaUtil');
const SessionFactory = require('../../models/Session');
const AnticipoFactory = require('../../models/Anticipo');
const AlertaMantenimientoFactory = require('../../models/AlertaMantenimiento');
const HistorialCambioFactory = require('../../models/HistorialCambio');
const TokenBlacklistFactory = require('../../models/TokenBlacklist');
const TelefonoVerificacionFactory = require('../../models/TelefonoVerificacion');

// Initialize models
const Role = RoleFactory(sequelize);
const Empresa = EmpresaFactory(sequelize);
const Usuario = UsuarioFactory(sequelize);
const Vehiculo = VehiculoFactory(sequelize);
const Jornada = JornadaFactory(sequelize);
const ChecklistDiario = ChecklistDiarioFactory(sequelize);
const ActividadGasto = ActividadGastoFactory(sequelize);
const ReportePdf = ReportePdfFactory(sequelize);
const MantenimientoVidaUtil = MantenimientoVidaUtilFactory(sequelize);
const Session = SessionFactory(sequelize);
const Anticipo = AnticipoFactory(sequelize);
const AlertaMantenimiento = AlertaMantenimientoFactory(sequelize);
const HistorialCambio = HistorialCambioFactory(sequelize);
const TokenBlacklist = TokenBlacklistFactory(sequelize);
const TelefonoVerificacion = TelefonoVerificacionFactory(sequelize);
// Associations
Empresa.hasMany(Usuario, { foreignKey: 'empresa_id', as: 'usuarios' });
Usuario.belongsTo(Empresa, { foreignKey: 'empresa_id', as: 'empresa' });

Role.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });
Usuario.belongsTo(Role, { foreignKey: 'rol_id', as: 'role' });

Usuario.hasMany(Empresa, { foreignKey: 'creado_por_id', as: 'empresas_creadas' });
Empresa.belongsTo(Usuario, { foreignKey: 'creado_por_id', as: 'creado_por' });

Usuario.hasMany(Jornada, { foreignKey: 'usuario_id', as: 'jornadas' });
Jornada.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Vehiculo.hasMany(Jornada, { foreignKey: 'vehiculo_id', as: 'jornadas' });
Jornada.hasOne(ChecklistDiario, { foreignKey: 'jornada_id', as: 'checklist' });
Jornada.belongsTo(Vehiculo, { foreignKey: 'vehiculo_id', as: 'vehiculo' });

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

// Token Blacklist associations
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
