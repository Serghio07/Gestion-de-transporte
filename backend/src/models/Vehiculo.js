const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Vehiculo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    unidad_nro: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    tipo: { type: DataTypes.STRING(50), allowNull: false },
    placa_serie: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    marca: { type: DataTypes.STRING(100), allowNull: true },
    modelo: { type: DataTypes.STRING(100), allowNull: true },
    anio: { type: DataTypes.SMALLINT, allowNull: true },
    color: { type: DataTypes.STRING(50), allowNull: true },
    uso_total_horas: { type: DataTypes.STRING, allowNull: false, defaultValue: '0 hours' },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, {
    tableName: 'vehiculos',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
    underscored: true
  });
};
