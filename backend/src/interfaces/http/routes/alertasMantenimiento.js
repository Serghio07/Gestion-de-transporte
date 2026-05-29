// API Routes - Alertas de mantenimiento

const createCrudRouter = require('./crudResource');
const { AlertaMantenimiento, Vehiculo, Usuario } = require('../../../infrastructure/persistence');

/**
 * @swagger
 * /api/alertas-mantenimiento:
 *   get:
 *     summary: Obtener alertas de mantenimiento
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Crear alerta de mantenimiento
 *     tags: [Alertas]
 *     security:
 *       - bearerAuth: []
 */
module.exports = createCrudRouter({
  model: AlertaMantenimiento,
  include: [
    { model: Vehiculo, as: 'vehiculo' },
    { model: Usuario, as: 'resuelta_por', attributes: ['id', 'nombre', 'email'] }
  ],
  allowedFilters: ['vehiculo_id', 'tipo_alerta', 'urgencia', 'resuelta'],
  order: [['creado_en', 'DESC']]
});
