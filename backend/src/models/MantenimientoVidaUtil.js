const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('MantenimientoVidaUtil', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'vehiculos', key: 'id' }
    },
    fecha_servicio: { type: DataTypes.DATEONLY, allowNull: false },
    tipo_servicio: { type: DataTypes.STRING(100), allowNull: false },
    tipo_mantenimiento: { type: DataTypes.STRING(100), allowNull: true },
    descripcion: { type: DataTypes.TEXT, allowNull: true },
    fecha_inicio: { type: DataTypes.DATE, allowNull: true },
    horometro_servicio: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    horometro_realizado: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    proximo_mantenimiento_h: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    costo_total: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    costo: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    proveedor: { type: DataTypes.STRING(255), allowNull: true },
    foto_factura_url: { type: DataTypes.STRING(500), allowNull: true },
    estado: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'realizado' },
    notas: { type: DataTypes.TEXT, allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
    realizado_por_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'usuarios', key: 'id' }
    },
    creado_en: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'mantenimiento_vida_util',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  });
};
