const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ActividadGasto', {
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
      }
    },
    tipo_actividad: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Diesel, Peaje, Alimento, Repuesto'
    },
    monto_gastado: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    cantidad_unidades: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: 'Cantidad en unidades, galones o m3'
    },
    proveedor_lugar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    foto_comprobante_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'actividades_gastos',
    timestamps: true,
    createdAt: false,
    updatedAt: false,
    underscored: true
  });
};
