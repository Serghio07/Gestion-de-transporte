// PostgreSQL database configuration
const config = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/gestion_transporte'
  },
  test: {
    url: process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/gestion_transporte_test'
  },
  production: {
    url: process.env.DATABASE_URL
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
