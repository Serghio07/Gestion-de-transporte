// API Routes - Jornadas

const express = require('express');
const { authMiddleware } = require('../../../shared/middleware');
const JornadaController = require('../controllers/JornadaController');

const router = express.Router();

const getController = (req) => new JornadaController(req.app.locals.diContainer);

/**
 * @swagger
 * /api/jornadas:
 *   post:
 *     summary: Crear nueva jornada
 *     description: Crea una nueva jornada de trabajo (requiere autenticación)
 *     tags: [Jornadas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - vehiculo_id
 *               - fecha_inicio
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *               vehiculo_id:
 *                 type: integer
 *                 example: 1
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               odometro_inicio:
 *                 type: number
 *                 example: 15000
 *               combustible_inicio:
 *                 type: number
 *                 example: 100
 *     responses:
 *       201:
 *         description: Jornada creada exitosamente
 *       401:
 *         description: No autorizado
 *       422:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, (req, res, next) => getController(req).create(req, res, next));

/**
 * @swagger
 * /api/jornadas:
 *   get:
 *     summary: Obtener lista de jornadas
 *     description: Obtiene lista paginada de todas las jornadas
 *     tags: [Jornadas]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: usuario_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: vehiculo_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de jornadas obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, (req, res, next) => getController(req).getAll(req, res, next));

/**
 * @swagger
 * /api/jornadas/{id}:
 *   get:
 *     summary: Obtener jornada por ID
 *     description: Obtiene los detalles de una jornada específica
 *     tags: [Jornadas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Jornada obtenida exitosamente
 *       404:
 *         description: Jornada no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, (req, res, next) => getController(req).getById(req, res, next));

/**
 * @swagger
 * /api/jornadas/{id}:
 *   put:
 *     summary: Actualizar jornada
 *     description: Actualiza los datos de una jornada (requiere autenticación)
 *     tags: [Jornadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Jornada actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Jornada no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, (req, res, next) => getController(req).update(req, res, next));

/**
 * @swagger
 * /api/jornadas/{id}:
 *   delete:
 *     summary: Eliminar jornada
 *     description: Elimina una jornada del sistema (requiere autenticación)
 *     tags: [Jornadas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Jornada eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Jornada no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, (req, res, next) => getController(req).delete(req, res, next));

module.exports = router;
