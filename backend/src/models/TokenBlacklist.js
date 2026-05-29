const { DataTypes } = require('sequelize');

/**
 * Modelo TokenBlacklist
 * Almacena tokens revocados (logout) de forma persistente
 * Permite que la blacklist persista a través de reinicios del servidor
 * y funcione en arquitectura distribuida (múltiples instancias)
 */
module.exports = (sequelize) => {
  return sequelize.define(
    'TokenBlacklist',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        comment: 'Token JWT completo revocado (logout)'
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'Usuario que hizo logout'
      },
      expira_en: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Fecha en la que el token expira naturalmente'
      },
      razon: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: 'logout',
        comment: 'Razón del revoque: logout, rotación, seguridad, etc.'
      },
      creado_en: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Cuándo fue agregado a la blacklist'
      }
    },
    {
      tableName: 'token_blacklist',
      timestamps: false,
      indexes: [
        {
          fields: ['token'],
          unique: true
        },
        {
          fields: ['usuario_id']
        },
        {
          fields: ['expira_en']
        }
      ],
      comment: 'Almacena tokens JWT revocados para logout permanente'
    }
  );
};
