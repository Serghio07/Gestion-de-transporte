// Auth Routes - Authentication endpoints

const express = require('express');
const container = require('../../../container');
const { authMiddleware } = require('../../../shared/middleware');

const router = express.Router();
const authController = container.get('authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar usuario por telefono
 *     description: Crea un usuario USER inactivo y envia un codigo de confirmacion por WhatsApp.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario creado y codigo enviado
 *       409:
 *         description: Telefono ya registrado
 *       422:
 *         description: Validacion fallida
 */
router.post('/register', (req, res, next) => authController.registerWithEmpresa(req, res, next));

/**
 * @swagger
 * /api/auth/verify-phone:
 *   post:
 *     summary: Confirmar telefono
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyPhoneRequest'
 *     responses:
 *       200:
 *         description: Cuenta verificada
 *       401:
 *         description: Codigo incorrecto
 *       410:
 *         description: Codigo expirado
 */
router.post('/verify-phone', (req, res, next) => authController.verifyPhone(req, res, next));
router.post('/verify-code', (req, res, next) => authController.verifyPhone(req, res, next));

/**
 * @swagger
 * /api/auth/resend-code:
 *   post:
 *     summary: Reenviar codigo de confirmacion
 *     description: Envia un nuevo codigo por WhatsApp sin iniciar sesion.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [telefono]
 *             properties:
 *               telefono:
 *                 type: string
 *                 example: "+59170000000"
 *     responses:
 *       200:
 *         description: Codigo reenviado
 */
router.post('/resend-code', (req, res, next) => authController.resendPhoneCode(req, res, next));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuario
 *     description: Inicia sesion con telefono y contrasena. No envia codigos de confirmacion.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales invalidas
 *       403:
 *         description: Telefono no confirmado
 */
router.post('/login', (req, res, next) => authController.login(req, res, next));

router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', authMiddleware, (req, res, next) => authController.logout(req, res, next));
router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next));
router.get('/sessions', authMiddleware, (req, res, next) => authController.getSessions(req, res, next));
router.delete('/sessions/:sessionId', authMiddleware, (req, res, next) => authController.revokeSession(req, res, next));

module.exports = router;
