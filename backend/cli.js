#!/usr/bin/env node

/**
 * CLI - Comandos útiles para el Backend
 * Uso: node cli.js [comando]
 */

const fs = require('fs');
const path = require('path');

const commands = {
  'dev': {
    desc: 'Iniciar servidor en modo desarrollo',
    run: () => require('child_process').spawn('npm', ['run', 'dev'], { stdio: 'inherit' })
  },
  'prod': {
    desc: 'Iniciar servidor en modo producción',
    run: () => require('child_process').spawn('npm', ['run', 'prod'], { stdio: 'inherit' })
  },
  'test': {
    desc: 'Ejecutar tests con cobertura',
    run: () => require('child_process').spawn('npm', ['test'], { stdio: 'inherit' })
  },
  'lint': {
    desc: 'Verificar código con ESLint',
    run: () => require('child_process').spawn('npm', ['run', 'lint'], { stdio: 'inherit' })
  },
  'fix': {
    desc: 'Arreglar código automáticamente',
    run: () => require('child_process').spawn('npm', ['run', 'lint:fix'], { stdio: 'inherit' })
  },
  'format': {
    desc: 'Formatear código con Prettier',
    run: () => require('child_process').spawn('npm', ['run', 'format'], { stdio: 'inherit' })
  },
  'seed': {
    desc: 'Sembrar BD con datos de prueba',
    run: () => require('child_process').spawn('npm', ['run', 'db:seed'], { stdio: 'inherit' })
  },
  'reset': {
    desc: 'Resetear BD (elimina todas las tablas)',
    run: () => require('child_process').spawn('npm', ['run', 'db:reset'], { stdio: 'inherit' })
  },
  'logs': {
    desc: 'Ver últimos logs de error',
    run: () => showLogs()
  },
  'cache': {
    desc: 'Ver estadísticas de caché',
    run: () => showCacheStats()
  },
  'help': {
    desc: 'Mostrar esta ayuda',
    run: () => showHelp()
  }
};

function showHelp() {
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  Backend CLI - Comandos Útiles          ║');
  console.log('╚══════════════════════════════════════════╝\n');
  
  console.log('Uso: npm run cli -- [comando]\n');
  console.log('Comandos disponibles:\n');
  
  Object.entries(commands).forEach(([cmd, obj]) => {
    console.log(`  ${cmd.padEnd(10)} - ${obj.desc}`);
  });
  
  console.log('\nEjemplos:');
  console.log('  npm run cli -- dev');
  console.log('  npm run cli -- seed');
  console.log('  npm run cli -- logs\n');
}

function showLogs() {
  const logsDir = path.join(__dirname, 'logs');
  
  if (!fs.existsSync(logsDir)) {
    console.log('No hay logs aún. Los logs aparecerán en ./logs/ cuando se ejecute el servidor.');
    return;
  }

  const files = fs.readdirSync(logsDir).filter(f => f.includes('error'));
  
  if (files.length === 0) {
    console.log('✓ No hay errores registrados');
    return;
  }

  files.forEach(file => {
    const filePath = path.join(logsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').slice(-20);
    
    console.log(`\n📄 Últimas líneas de ${file}:`);
    console.log('─'.repeat(50));
    lines.forEach(line => {
      if (line) console.log(line);
    });
  });
}

function showCacheStats() {
  console.log('\nℹ️  Ejecuta esta función dentro de tu app para ver estadísticas de caché:');
  console.log(`
    const CacheService = require('./src/utils/cacheService');
    console.log(CacheService.getStats());
  `);
}

// Ejecutar comando
const cmd = process.argv[2] || 'help';

if (commands[cmd]) {
  console.log(`\n▶️  Ejecutando: ${cmd}\n`);
  commands[cmd].run();
} else {
  console.log(`❌ Comando desconocido: ${cmd}`);
  showHelp();
  process.exit(1);
}
