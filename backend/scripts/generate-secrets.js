#!/usr/bin/env node

/**
 * Script para generar claves JWT seguras
 * Uso: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret(label, length = 64) {
  const secret = crypto.randomBytes(length).toString('hex');
  console.log(`${label}: ${secret}`);
  return secret;
}

console.log('\n' + '='.repeat(60));
console.log('Generador de Secretos Seguros para JWT');
console.log('='.repeat(60) + '\n');

console.log('Copia estos valores en tu archivo .env:\n');

generateSecret('JWT_SECRET');
generateSecret('JWT_REFRESH_SECRET');

console.log('\n' + '='.repeat(60));
console.log('✓ Secretos generados exitosamente');
console.log('⚠  IMPORTANTE: Mantener estos valores seguros');
console.log('⚠  NUNCA hacer commit de secretos en git');
console.log('='.repeat(60) + '\n');
