// API Routes - Sesiones activas

const createCrudRouter = require('./crudResource');
const { Session, Usuario } = require('../../../infrastructure/persistence');

/**
 * @swagger
 * /api/sesiones:
 *   get:
 *     summary: Obtener sesiones activas
 *     tags: [Sesiones]
 *     security:
 *       - bearerAuth: []
 */
module.exports = createCrudRouter({
  model: Session,
  include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre', 'email'] }],
  allowedFilters: ['usuario_id', 'activa'],
  order: [['creado_en', 'DESC']],
  readOnly: true
});
