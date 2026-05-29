require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./infrastructure/persistence');
const { logger } = require('./shared/utils');
const { setupDIContainer } = require('./infrastructure/di/DIContainer');
const { validateEnvironment, logEnvironment } = require('./shared/config/environment');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Validate environment variables
    validateEnvironment();
    logEnvironment();

    // Database connection
    await sequelize.authenticate();
    logger.info('✓ Database connected');

    // Sync models (preservar tablas existentes)
    // La base ya existe y tiene vistas/triggers; no usar sync() en runtime.
    logger.info('Database schema managed externally');

    // Setup Dependency Injection Container
    const diContainer = setupDIContainer(sequelize);
    app.locals.diContainer = diContainer;
    logger.info('✓ DI Container configured');

    // Start Express server
    const server = app.listen(PORT, () => {
      logger.info(`✓ Server listening on port ${PORT}`);
      console.log(`\n${'='.repeat(60)}`);
      console.log(`✓ API running at http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`${'='.repeat(60)}\n`);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      logger.warn('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        sequelize.close().then(() => {
          logger.info('Database connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      logger.warn('SIGINT signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        sequelize.close().then(() => {
          logger.info('Database connection closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    logger.error('Server startup failed', error);
    process.exit(1);
  }
};

// Global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at Promise', reason);
});

// Global uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

startServer();
