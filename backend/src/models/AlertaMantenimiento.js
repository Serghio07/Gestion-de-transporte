const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AlertaMantenimiento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehiculos',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    tipo_alerta: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'preventivo'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    horas_actuales: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    horas_limite: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    horas_restantes: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true
    },
    urgencia: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'media'
    },
    resuelta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    resuelta_en: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resuelta_por_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      onDelete: 'SET NULL'
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'alertas_mantenimiento',
    timestamps: false
  });
};
