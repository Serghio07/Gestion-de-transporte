// Shared - Environment validation middleware

const requiredVars = [
  'NODE_ENV',
  'PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'CORS_ORIGIN'
];

function validateEnvironment() {
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n📋 Copy .env.example to .env and fill in the required values');
    process.exit(1);
  }

  console.log('✅ Environment variables validated');
}

function logEnvironment() {
  console.log('\n📦 Active Environment:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   PORT: ${process.env.PORT}`);
  console.log(`   DB_HOST: ${process.env.DB_HOST}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME}`);
  console.log(`   CORS: ${process.env.CORS_ORIGIN}`);
  console.log();
}

module.exports = {
  validateEnvironment,
  logEnvironment
};
