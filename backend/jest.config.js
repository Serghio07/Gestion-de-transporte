/**
 * Configuración de Jest para Testing
 */

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js',
    '!src/config/**'
  ],
  testTimeout: 10000,
  verbose: true,
  bail: false
};
