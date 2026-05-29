// API Routes - Actividades

const express = require('express');
const { authMiddleware } = require('../../../shared/middleware');
const ActividadController = require('../controllers/ActividadController');

const router = express.Router();

const getController = (req) => new ActividadController(req.app.locals.diContainer);

/**
 * @swagger
 * /api/actividades:
 *   post:
 *     summary: Crear nueva actividad/gasto
 *     description: Crea una nueva actividad o gasto (requiere autenticación)
 *     tags: [Actividades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jornada_id
 *               - descripcion
 *               - tipo
 *               - monto
 *             properties:
 *               jornada_id:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               tipo:
 *                 type: string
 *               monto:
 *                 type: number
 *               fecha_registro:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Actividad creada exitosamente
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
 * /api/actividades:
 *   get:
 *     summary: Obtener lista de actividades
 *     description: Obtiene lista paginada de todas las actividades/gastos
 *     tags: [Actividades]
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
 *         name: jornada_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de actividades obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, (req, res, next) => getController(req).getAll(req, res, next));

/**
 * @swagger
 * /api/actividades/{id}:
 *   get:
 *     summary: Obtener actividad por ID
 *     description: Obtiene los detalles de una actividad específica
 *     tags: [Actividades]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actividad obtenida exitosamente
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, (req, res, next) => getController(req).getById(req, res, next));

/**
 * @swagger
 * /api/actividades/{id}:
 *   put:
 *     summary: Actualizar actividad
 *     description: Actualiza los datos de una actividad (requiere autenticación)
 *     tags: [Actividades]
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
 *         description: Actividad actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, (req, res, next) => getController(req).update(req, res, next));

/**
 * @swagger
 * /api/actividades/{id}:
 *   delete:
 *     summary: Eliminar actividad
 *     description: Elimina una actividad del sistema (requiere autenticación)
 *     tags: [Actividades]
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
 *         description: Actividad eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, (req, res, next) => getController(req).delete(req, res, next));

module.exports = router;
