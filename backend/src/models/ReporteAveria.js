const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ReporteAveria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jornada_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'jornadas',
        key: 'id'
      },
      comment: 'Jornada en que ocurrió (opcional)'
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehiculos',
        key: 'id'
      },
      comment: 'Vehículo con falla'
    },
    descripcion_falla: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Descripción detallada'
    },
    tipo_averia: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Motor, Eléctrica, Hidráulica, Neumáticos, etc'
    },
    gravedad: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Baja, Media, Alta, Crítica'
    },
    ubicacion_falla: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Dónde se detectó'
    },
    foto_falla_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL de foto de la falla'
    },
    fecha_reporte: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Fecha del reporte'
    },
    reparado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'true=reparado, false=pendiente'
    },
    fecha_reparacion: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha de reparación'
    },
    costo_reparacion: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Costo de reparación'
    },
    observaciones_reparacion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Notas de reparación'
    }
  }, {
    tableName: 'reporte_averias',
    timestamps: true,
    underscored: true
  });
};
