const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: true },
    empresa_transporte: { type: DataTypes.STRING(150), allowNull: true },
    foto_url: { type: DataTypes.TEXT, allowNull: true },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    pin_acceso: { type: DataTypes.STRING(10), allowNull: true },
    email: { type: DataTypes.STRING(100), allowNull: true, unique: true },
    telefono: { type: DataTypes.STRING(30), allowNull: false, unique: true },
    telefono_verificado_en: { type: DataTypes.DATE, allowNull: true },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'empresas', key: 'id' }
    },
    rol_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'roles', key: 'id' }
    },
    activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    token_sesion_activo: { type: DataTypes.STRING(500), allowNull: true },
    ultimo_acceso: { type: DataTypes.DATE, allowNull: true },
    intentos_fallidos: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    bloqueado_hasta: { type: DataTypes.DATE, allowNull: true },
    ultimo_login: { type: DataTypes.DATE, allowNull: true },
    password_cambiado_en: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
    underscored: true
  });
};
