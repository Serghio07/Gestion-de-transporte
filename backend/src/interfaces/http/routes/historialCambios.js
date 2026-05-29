// API Routes - Historial de cambios

const createCrudRouter = require('./crudResource');
const { HistorialCambio } = require('../../../infrastructure/persistence');

/**
 * @swagger
 * /api/historial-cambios:
 *   get:
 *     summary: Obtener historial de cambios
 *     tags: [Auditoria]
 *     security:
 *       - bearerAuth: []
 */
module.exports = createCrudRouter({
  model: HistorialCambio,
  allowedFilters: ['tabla_afectada', 'registro_id', 'operacion'],
  order: [['creado_en', 'DESC']],
  readOnly: true
});
