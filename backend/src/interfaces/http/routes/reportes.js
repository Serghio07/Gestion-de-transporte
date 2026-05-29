// API Routes - Reportes

const express = require('express');
const { authMiddleware } = require('../../../shared/middleware');
const ReporteController = require('../controllers/ReporteController');

const router = express.Router();

const getController = (req) => new ReporteController(req.app.locals.diContainer);

/**
 * @swagger
 * /api/reportes:
 *   post:
 *     summary: Crear nuevo reporte de avería
 *     description: Crea un nuevo reporte de avería (requiere autenticación)
 *     tags: [Reportes]
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
 *               - severidad
 *             properties:
 *               jornada_id:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               severidad:
 *                 type: string
 *                 enum: [baja, media, alta, critica]
 *               area_afectada:
 *                 type: string
 *               fecha_reporte:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reporte creado exitosamente
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
 * /api/reportes:
 *   get:
 *     summary: Obtener lista de reportes
 *     description: Obtiene lista paginada de todos los reportes de averías
 *     tags: [Reportes]
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
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: severidad
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de reportes obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, (req, res, next) => getController(req).getAll(req, res, next));

/**
 * @swagger
 * /api/reportes/{id}:
 *   get:
 *     summary: Obtener reporte por ID
 *     description: Obtiene los detalles de un reporte específico
 *     tags: [Reportes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reporte obtenido exitosamente
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, (req, res, next) => getController(req).getById(req, res, next));

/**
 * @swagger
 * /api/reportes/{id}:
 *   put:
 *     summary: Actualizar reporte
 *     description: Actualiza los datos de un reporte (requiere autenticación)
 *     tags: [Reportes]
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
 *         description: Reporte actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, (req, res, next) => getController(req).update(req, res, next));

/**
 * @swagger
 * /api/reportes/{id}:
 *   delete:
 *     summary: Eliminar reporte
 *     description: Elimina un reporte del sistema (requiere autenticación)
 *     tags: [Reportes]
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
 *         description: Reporte eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Reporte no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, (req, res, next) => getController(req).delete(req, res, next));

module.exports = router;
