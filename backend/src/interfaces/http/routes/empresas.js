const express = require('express');
const { Sequelize } = require('sequelize');
const { authMiddleware, authorizationMiddleware } = require('../../../shared/middleware');
const { Empresa } = require('../../../infrastructure/persistence');

const router = express.Router();

function normalizeName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

/**
 * @swagger
 * /api/empresas:
 *   get:
 *     summary: Listar empresas
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Empresa'
 */
router.get('/', authMiddleware, authorizationMiddleware(1), async (req, res, next) => {
  try {
    const empresas = await Empresa.findAll({
      order: [['nombre', 'ASC']]
    });

    res.json({
      success: true,
      data: empresas,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/empresas:
 *   post:
 *     summary: Crear empresa
 *     description: Solo administradores. Rechaza nombres repetidos sin distinguir mayusculas/minusculas.
 *     tags:
 *       - Empresas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "TranspoSystem"
 *               telefono:
 *                 type: string
 *                 example: "77777777"
 *     responses:
 *       201:
 *         description: Empresa creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Empresa'
 *       409:
 *         description: Ya existe una empresa con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authMiddleware, authorizationMiddleware(1), async (req, res, next) => {
  try {
    const nombre = normalizeName(req.body.nombre || req.body.empresa || req.body.empresa_nombre);
    const telefono = req.body.telefono ? String(req.body.telefono).trim() : null;

    if (!nombre || nombre.length < 2) {
      return res.status(422).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Nombre de empresa requerido' },
        timestamp: new Date().toISOString()
      });
    }

    const existing = await Empresa.findOne({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('nombre')),
        nombre.toLowerCase()
      )
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMPRESA_EXISTS', message: 'Ya existe una empresa con ese nombre' },
        timestamp: new Date().toISOString()
      });
    }

    const empresa = await Empresa.create({
      nombre,
      telefono,
      creado_por_id: req.user.id
    });

    res.status(201).json({
      success: true,
      data: empresa,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
