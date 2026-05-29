// API Routes - Vehiculos

const express = require('express');
const { authMiddleware } = require('../../../shared/middleware');
const VehiculoController = require('../controllers/VehiculoController');

const router = express.Router();

const getController = (req) => new VehiculoController(req.app.locals.diContainer);

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear nuevo vehículo
 *     description: Crea un nuevo vehículo en el sistema (requiere autenticación)
 *     tags: [Vehículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidad_nro
 *               - tipo
 *             properties:
 *               unidad_nro:
 *                 type: string
 *                 example: "VOL-01"
 *               tipo:
 *                 type: string
 *                 example: "Volqueta"
 *               placa_serie:
 *                 type: string
 *                 example: "ABC-123"
 *               marca:
 *                 type: string
 *                 example: "Volvo"
 *               modelo:
 *                 type: string
 *                 example: "FH16"
 *               anio:
 *                 type: integer
 *                 example: 2020
 *               combustible_actual:
 *                 type: string
 *                 example: "Diesel"
 *               capacidad_carga:
 *                 type: number
 *                 example: 25.5
 *               estado:
 *                 type: string
 *                 enum: [activo, inactivo, mantenimiento]
 *     responses:
 *       201:
 *         description: Vehículo creado exitosamente
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
 * /api/vehiculos:
 *   get:
 *     summary: Obtener lista de vehículos
 *     description: Obtiene lista paginada de todos los vehículos
 *     tags: [Vehículos]
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
 *         name: tipo
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: unidad_nro
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de vehículos obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, (req, res, next) => getController(req).getAll(req, res, next));

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener vehículo por ID
 *     description: Obtiene los detalles de un vehículo específico
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vehículo obtenido exitosamente
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, (req, res, next) => getController(req).getById(req, res, next));

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   put:
 *     summary: Actualizar vehículo
 *     description: Actualiza los datos de un vehículo (requiere autenticación)
 *     tags: [Vehículos]
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
 *         description: Vehículo actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, (req, res, next) => getController(req).update(req, res, next));

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   delete:
 *     summary: Eliminar vehículo
 *     description: Elimina un vehículo del sistema (requiere autenticación)
 *     tags: [Vehículos]
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
 *         description: Vehículo eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, (req, res, next) => getController(req).delete(req, res, next));

module.exports = router;
