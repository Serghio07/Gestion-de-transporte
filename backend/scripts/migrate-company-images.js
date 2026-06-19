require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { sequelize } = require('../src/infrastructure/persistence');

async function migrate() {
  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'migrations', '20260604_empresa_imagenes.sql'),
    'utf8'
  );

  await sequelize.authenticate();
  await sequelize.query(sql);
  console.log('Migration empresa/images applied');
  await sequelize.close();
}

migrate().catch(async (error) => {
  console.error(error.message);
  await sequelize.close();
  process.exitCode = 1;
});
