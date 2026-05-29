const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Empresa', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING(30), allowNull: true },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    creado_por_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'usuarios', key: 'id' }
    }
  }, {
    tableName: 'empresas',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
    underscored: true
  });
};
