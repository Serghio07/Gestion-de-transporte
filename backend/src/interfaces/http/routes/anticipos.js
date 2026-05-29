// API Routes - Anticipos

const createCrudRouter = require('./crudResource');
const { Anticipo, Jornada, Usuario } = require('../../../infrastructure/persistence');

/**
 * @swagger
 * /api/anticipos:
 *   get:
 *     summary: Obtener anticipos
 *     tags: [Anticipos]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Crear anticipo
 *     tags: [Anticipos]
 *     security:
 *       - bearerAuth: []
 */
module.exports = createCrudRouter({
  model: Anticipo,
  include: [
    { model: Jornada, as: 'jornada' },
    { model: Usuario, as: 'entregado_por_usuario', attributes: ['id', 'nombre', 'email'] }
  ],
  allowedFilters: ['jornada_id', 'entregado_por'],
  order: [['creado_en', 'DESC']]
});
