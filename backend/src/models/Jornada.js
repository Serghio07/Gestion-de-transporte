const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Jornada', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' }
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'vehiculos', key: 'id' }
    },
    estado: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'activa' },
    fecha_hora_inicio: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    fecha_hora_cierre: { type: DataTypes.DATE, allowNull: true },
    duracion_jornada: { type: DataTypes.STRING, allowNull: true },
    capital_recibido: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    viaticos_entregados: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    total_gastos: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    saldo_rendido: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    diferencia_caja: { type: DataTypes.DECIMAL(15, 2), allowNull: true },
    aprobado_por_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'usuarios', key: 'id' }
    },
    aprobado_en: { type: DataTypes.DATE, allowNull: true },
    gps_inicio: { type: DataTypes.STRING(100), allowNull: true },
    gps_final: { type: DataTypes.STRING(100), allowNull: true },
    odometro_inicio: { type: DataTypes.DECIMAL(10, 1), allowNull: true },
    odometro_fin: { type: DataTypes.DECIMAL(10, 1), allowNull: true },
    km_recorridos: { type: DataTypes.DECIMAL(10, 1), allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'jornadas',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
    underscored: true
  });
};
