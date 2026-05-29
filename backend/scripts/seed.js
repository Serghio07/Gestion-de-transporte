/**
 * Script para popular la BD con datos de prueba
 * Uso: npm run db:seed
 */

require('dotenv').config();
const { sequelize, Role, Usuario, Vehiculo } = require('../src/models');
const SecurityService = require('../src/services/securityService');

async function seed() {
  try {
    console.log('🌱 Iniciando seed de base de datos...\n');

    // Sincronizar BD
    // La base se administra con SQL/migraciones; sync() fuerza alter con relaciones ciclicas.
    console.log('✓ Base de datos sincronizada');

    // Crear roles
    console.log('\n📌 Creando roles...');
    const roles = await Role.bulkCreate([
      { nombre: 'Admin', descripcion: 'Administrador del sistema' },
      { nombre: 'Trabajador', descripcion: 'Usuario trabajador' },
      { nombre: 'Supervisor', descripcion: 'Supervisor de operaciones' }
    ], { ignoreDuplicates: true });
    console.log(`✓ ${roles.length} roles creados`);

    // Crear usuarios de prueba
    console.log('\n📌 Creando usuarios de prueba...');
    const usuarios = [
      {
        nombre: 'admin',
        password: 'Admin123!@#',
        email: 'admin@transporte.com',
        pin_acceso: '123456',
        rol_id: 1
      },
      {
        nombre: 'juan_perez',
        password: 'Juan123!@#',
        email: 'juan@transporte.com',
        pin_acceso: '654321',
        rol_id: 2
      },
      {
        nombre: 'supervisor_maria',
        password: 'Maria123!@#',
        email: 'maria@transporte.com',
        pin_acceso: '999999',
        rol_id: 3
      }
    ];

    for (const userData of usuarios) {
      const passwordHash = await SecurityService.hashPassword(userData.password);
      await Usuario.findOrCreate({
        where: { nombre: userData.nombre },
        defaults: {
          ...userData,
          password_hash: passwordHash,
          activo: true
        }
      });
    }
    console.log(`✓ ${usuarios.length} usuarios creados`);

    // Crear vehículos de prueba
    console.log('\n📌 Creando vehículos de prueba...');
    const vehiculos = [
      {
        unidad_nro: 'VOL-001',
        tipo: 'Volqueta',
        placa_serie: 'ABC-1234',
        marca: 'Hino',
        modelo: '500',
        anio: 2020,
        horometro_acumulado: 5000,
        activo: true
      },
      {
        unidad_nro: 'VOL-002',
        tipo: 'Volqueta',
        placa_serie: 'DEF-5678',
        marca: 'Hino',
        modelo: '500',
        anio: 2021,
        horometro_acumulado: 3500,
        activo: true
      },
      {
        unidad_nro: 'TRACTOR-001',
        tipo: 'Tractor',
        placa_serie: 'GHI-9012',
        marca: 'Caterpillar',
        modelo: 'D6T',
        anio: 2019,
        horometro_acumulado: 8000,
        activo: true
      },
      {
        unidad_nro: 'MOTO-001',
        tipo: 'Motocicleta',
        placa_serie: 'JKL-3456',
        marca: 'Honda',
        modelo: 'CRF450',
        anio: 2022,
        horometro_acumulado: 200,
        activo: true
      }
    ];

    for (const vehiculoData of vehiculos) {
      await Vehiculo.findOrCreate({
        where: { unidad_nro: vehiculoData.unidad_nro },
        defaults: vehiculoData
      });
    }
    console.log(`✓ ${vehiculos.length} vehículos creados`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Seed completado exitosamente');
    console.log('='.repeat(50));
    console.log('\n👤 Usuarios de prueba:');
    console.log('  - admin / Admin123!@# (PIN: 123456)');
    console.log('  - juan_perez / Juan123!@# (PIN: 654321)');
    console.log('  - supervisor_maria / Maria123!@# (PIN: 999999)');
    console.log('\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error.message);
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

seed();
