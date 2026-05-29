const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('HistorialCambio', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    tabla_afectada: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    registro_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    operacion: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    usuario_db: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: sequelize.literal('current_user')
    },
    valor_anterior: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    valor_nuevo: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    campos_modificados: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    ip_origen: {
      type: DataTypes.INET,
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'historial_cambios',
    timestamps: false
  });
};
