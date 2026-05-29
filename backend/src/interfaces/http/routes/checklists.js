// API Routes - Checklists

const express = require('express');
const { authMiddleware } = require('../../../shared/middleware');
const ChecklistController = require('../controllers/ChecklistController');

const router = express.Router();

const getController = (req) => new ChecklistController(req.app.locals.diContainer);

/**
 * @swagger
 * /api/checklists:
 *   post:
 *     summary: Crear nuevo checklist
 *     description: Crea un nuevo checklist diario (requiere autenticación)
 *     tags: [Checklists]
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
 *             properties:
 *               jornada_id:
 *                 type: integer
 *               item_nro:
 *                 type: integer
 *               descripcion:
 *                 type: string
 *               estado_verificacion:
 *                 type: string
 *               observaciones:
 *                 type: string
 *     responses:
 *       201:
 *         description: Checklist creado exitosamente
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
 * /api/checklists:
 *   get:
 *     summary: Obtener lista de checklists
 *     description: Obtiene lista paginada de todos los checklists
 *     tags: [Checklists]
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
 *         name: estado_verificacion
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de checklists obtenida exitosamente
 *       500:
 *         description: Error del servidor
 */
router.get('/', authMiddleware, (req, res, next) => getController(req).getAll(req, res, next));

/**
 * @swagger
 * /api/checklists/{id}:
 *   get:
 *     summary: Obtener checklist por ID
 *     description: Obtiene los detalles de un checklist específico
 *     tags: [Checklists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Checklist obtenido exitosamente
 *       404:
 *         description: Checklist no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', authMiddleware, (req, res, next) => getController(req).getById(req, res, next));

/**
 * @swagger
 * /api/checklists/{id}:
 *   put:
 *     summary: Actualizar checklist
 *     description: Actualiza los datos de un checklist (requiere autenticación)
 *     tags: [Checklists]
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
 *         description: Checklist actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Checklist no encontrado
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', authMiddleware, (req, res, next) => getController(req).update(req, res, next));

/**
 * @swagger
 * /api/checklists/{id}:
 *   delete:
 *     summary: Eliminar checklist
 *     description: Elimina un checklist del sistema (requiere autenticación)
 *     tags: [Checklists]
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
 *         description: Checklist eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Checklist no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', authMiddleware, (req, res, next) => getController(req).delete(req, res, next));

module.exports = router;
