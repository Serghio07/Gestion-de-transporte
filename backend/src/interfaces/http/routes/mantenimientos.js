// API Routes - Mantenimientos

const express = require('express');
const router = express.Router();
const MantenimientoController = require('../controllers/MantenimientoController');

const getController = (req) => new MantenimientoController(req.app.locals.diContainer);
const { authMiddleware, authorizationMiddleware } = require('../../../shared/middleware');

/**
 * @swagger
 * /api/mantenimientos:
 *   post:
 *     summary: Crear nuevo mantenimiento
 *     description: Crea un nuevo registro de mantenimiento (requiere autenticación)
 *     tags: [Mantenimientos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehiculo_id
 *               - tipo_mantenimiento
 *             properties:
 *               vehiculo_id:
 *                 type: integer
 *               tipo_mantenimiento:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               horometro_realizado:
 *                 type: number
 *               costo:
 *                 type: number
 *               proveedor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mantenimiento creado exitosamente
 *       401:
 *         description: No autorizado
 *       422:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', authMiddleware, (req, res, next) => {
  getController(req).create(req, res, next);
});

/**
 * @swagger
 * /api/mantenimientos:
 *   get:
 *     summary: Obtener lista de mantenimientos
 *     description: Obtiene lista paginada de todos los mantenimientos
 *     tags: [Mantenimientos]
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
 *         name: vehiculo_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipo_mantenimiento
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de mantenimientos obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, (req, res, next) => {
  getController(req).getAll(req, res, next);
});

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   get:
 *     summary: Obtener mantenimiento por ID
 *     description: Obtiene los detalles de un mantenimiento específico
 *     tags: [Mantenimientos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mantenimiento obtenido exitosamente
 *       404:
 *         description: Mantenimiento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, (req, res, next) => {
  getController(req).getById(req, res, next);
});

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   put:
 *     summary: Actualizar mantenimiento
 *     description: Actualiza los datos de un mantenimiento (requiere autenticación)
 *     tags: [Mantenimientos]
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
 *         description: Mantenimiento actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mantenimiento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, (req, res, next) => {
  getController(req).update(req, res, next);
});

/**
 * @swagger
 * /api/mantenimientos/{id}:
 *   delete:
 *     summary: Eliminar mantenimiento
 *     description: Elimina un mantenimiento del sistema (requiere autenticación)
 *     tags: [Mantenimientos]
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
 *         description: Mantenimiento eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Mantenimiento no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, authorizationMiddleware(1), (req, res, next) => {
  getController(req).delete(req, res, next);
});

module.exports = router;
