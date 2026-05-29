const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Anticipo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jornada_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jornadas',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    monto: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    concepto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    entregado_por: {
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
    tableName: 'anticipos',
    timestamps: false
  });
};
