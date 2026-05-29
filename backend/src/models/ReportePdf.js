const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ReportePdf', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_archivo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipo_reporte: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    fecha_desde: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_hasta: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    generado_por_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    url_descarga: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    resumen_json: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    tableName: 'reportes_pdf',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
    underscored: true
  });
};