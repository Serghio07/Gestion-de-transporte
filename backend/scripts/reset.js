/**
 * Script para resetear la BD (eliminar todas las tablas y recrearlas)
 * Uso: npm run db:reset
 */

require('dotenv').config();
const { sequelize } = require('../src/models');

async function reset() {
  try {
    console.log('⚠️  ADVERTENCIA: Esto eliminará todas las tablas');
    console.log('Presione Ctrl+C para cancelar...\n');

    // Esperar 3 segundos para dar tiempo a cancelar
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔄 Eliminando y recreando base de datos...\n');

    // Eliminar todas las tablas
    await sequelize.drop();
    console.log('✓ Tablas eliminadas');

    // Crear nuevas tablas
    await sequelize.sync({ force: true });
    console.log('✓ Tablas recreadas');

    console.log('\n' + '='.repeat(50));
    console.log('✅ Base de datos reseteada');
    console.log('='.repeat(50));
    console.log('\n💡 Ejecuta: npm run db:seed (para popular con datos de prueba)');
    console.log('\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al resetear BD:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

reset();
