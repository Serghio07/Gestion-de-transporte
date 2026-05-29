require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

// Shared middleware and utilities
const { errorMiddleware } = require('./shared/middleware');
const { formatResponse } = require('./shared/utils');

// Routes
const usuariosRouter = require('./interfaces/http/routes/usuarios');
const authRouter = require('./interfaces/http/routes/auth');
const vehiculosRouter = require('./interfaces/http/routes/vehiculos');
const jornadasRouter = require('./interfaces/http/routes/jornadas');
const rolesRouter = require('./interfaces/http/routes/roles');
const checklistsRouter = require('./interfaces/http/routes/checklists');
const actividadesRouter = require('./interfaces/http/routes/actividades');
const reportesRouter = require('./interfaces/http/routes/reportes');
const mantenimientosRouter = require('./interfaces/http/routes/mantenimientos');
const empresasRouter = require('./interfaces/http/routes/empresas');
const anticiposRouter = require('./interfaces/http/routes/anticipos');
const alertasMantenimientoRouter = require('./interfaces/http/routes/alertasMantenimiento');
const historialCambiosRouter = require('./interfaces/http/routes/historialCambios');
const sesionesRouter = require('./interfaces/http/routes/sesiones');
const { sequelize } = require('./infrastructure/persistence');
const { setupDIContainer } = require('./infrastructure/di/DIContainer');

const app = express();
app.locals.diContainer = setupDIContainer(sequelize);

// ========================
// Security Middleware
// ========================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// ========================
// Rate Limiting
// ========================
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX || 100),
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => process.env.NODE_ENV !== 'production'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});

app.use(globalLimiter);

// ========================
// Body Parsing & Cookies
// ========================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser()); // Parsear cookies para poder acceder en req.cookies

// ========================
// Swagger/OpenAPI Documentation
// ========================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    showRequestHeaders: true
  }
}));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// ========================
// Routes
// ========================

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Server Running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /health',
      docs: 'GET /api-docs',
      auth: 'POST /api/auth/login'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json(formatResponse(true, 'Server running'));
});

// API Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/vehiculos', vehiculosRouter);
app.use('/api/jornadas', jornadasRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/checklists', checklistsRouter);
app.use('/api/actividades', actividadesRouter);
app.use('/api/reportes', reportesRouter);
app.use('/api/mantenimientos', mantenimientosRouter);
app.use('/api/empresas', empresasRouter);
app.use('/api/anticipos', anticiposRouter);
app.use('/api/alertas-mantenimiento', alertasMantenimientoRouter);
app.use('/api/historial-cambios', historialCambiosRouter);
app.use('/api/sesiones', sesionesRouter);

// ========================
// 404 Handler
// ========================
app.use((req, res) => {
  res.status(404).json(
    formatResponse(false, 'Route not found: ' + req.path)
  );
});

// ========================
// Global Error Handler
// ========================
app.use(errorMiddleware);

module.exports = app;
