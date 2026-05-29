/**
 * Tests básicos para la API
 * Jest + Supertest
 * 
 * NOTA: Para ejecutar:
 * npm test
 */

const request = require('supertest');
const app = require('../src/app');

describe('API Health', () => {
  it('debe retornar estado del servidor', async () => {
    const res = await request(app).get('/health');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body.success).toBe(true);
  });
});

describe('Authentication', () => {
  it('debe retornar error sin credenciales', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({});
    
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('debe retornar error con credenciales inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        telefono: '+59179999999',
        password: 'password123'
      });
    
    expect(res.status).toBeGreaterThanOrEqual(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Protected Routes', () => {
  it('debe retornar 401 sin token', async () => {
    const res = await request(app)
      .get('/api/usuarios');
    
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('debe retornar 401 con token inválido', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', 'Bearer invalid_token_12345');
    
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('Error Handling', () => {
  it('debe retornar 404 para ruta inexistente', async () => {
    const res = await request(app)
      .get('/api/ruta-inexistente-12345');
    
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('debe validar entrada JSON inválida', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Content-Type', 'application/json')
      .send('{ invalid json');
    
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});

describe('DTO Validation', () => {
  it('debe rechazar usuario sin nombre', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        telefono: '+59170000111',
        password: 'Password123!',
        rol_id: 1
      });
    
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('debe rechazar telefono invalido', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        nombre: 'Test User',
        telefono: '123',
        password: 'Password123!',
        rol_id: 1
      });
    
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('debe rechazar contraseña corta', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .send({
        nombre: 'Test User',
        telefono: '+59170000112',
        password: 'short',
        rol_id: 1
      });
    
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
