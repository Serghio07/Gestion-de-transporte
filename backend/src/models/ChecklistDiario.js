const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ChecklistDiario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jornada_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'jornadas', key: 'id' }
    },
    llantas_ok: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    luces_ok: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    frenos_ok: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    niveles_ok: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    extintor_ok: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    documentos_ok: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    cinturones_ok: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    firma_conductor: { type: DataTypes.STRING(255), allowNull: true },
    foto_estado_url: { type: DataTypes.STRING(500), allowNull: true },
    comentarios: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: 'checklist_diario',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: false,
    underscored: true
  });
};
