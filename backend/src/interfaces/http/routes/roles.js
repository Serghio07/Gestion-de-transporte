// API Routes - Roles

const express = require('express');
const { authMiddleware, authorizationMiddleware } = require('../../../shared/middleware');
const RoleController = require('../controllers/RoleController');

const router = express.Router();

const getController = (req) => new RoleController(req.app.locals.diContainer);

router.post('/', authMiddleware, authorizationMiddleware(1), (req, res, next) => getController(req).create(req, res, next));
router.get('/', authMiddleware, (req, res, next) => getController(req).getAll(req, res, next));
router.get('/:id', authMiddleware, (req, res, next) => getController(req).getById(req, res, next));
router.put('/:id', authMiddleware, authorizationMiddleware(1), (req, res, next) => getController(req).update(req, res, next));
router.delete('/:id', authMiddleware, authorizationMiddleware(1), (req, res, next) => getController(req).delete(req, res, next));

module.exports = router;
