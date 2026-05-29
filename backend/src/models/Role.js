const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Role', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: 'Admin, Trabajador, Supervisor'
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Descripción del rol'
    }
  }, {
    tableName: 'roles',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['nombre'],
        name: 'idx_roles_nombre_unique'
      }
    ]
  });
};
