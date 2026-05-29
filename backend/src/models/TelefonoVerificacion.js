const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TelefonoVerificacion', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' }
    },
    telefono: { type: DataTypes.STRING(30), allowNull: false },
    codigo_hash: { type: DataTypes.STRING(255), allowNull: false },
    expira_en: { type: DataTypes.DATE, allowNull: false },
    consumido: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    intentos: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 }
  }, {
    tableName: 'telefono_verificaciones',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
    underscored: true
  });
};
