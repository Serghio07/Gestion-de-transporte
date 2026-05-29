const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Transporte',
      version: '2.0.0',
      description: 'Backend profesional y seguro para gestión de transporte con Node.js, Express y PostgreSQL',
      contact: {
        name: 'API Support',
        email: 'support@gestion-transporte.com'
      },
      license: {
        name: 'ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      },
      {
        url: 'https://api.gestion-transporte.com',
        description: 'Servidor de Producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header usando Bearer schema'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            code: { type: 'string' },
            message: { type: 'string' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'juan@example.com' },
            password: { type: 'string', example: 'SecurePass123' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                usuario: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    nombre: { type: 'string' },
                    rol: { type: 'string' }
                  }
                },
                tokens: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' }
                  }
                }
              }
            }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            email: { type: 'string', format: 'email' },
            rol_id: { type: 'integer' },
            activo: { type: 'boolean' },
            creado_en: { type: 'string', format: 'date-time' },
            actualizado_en: { type: 'string', format: 'date-time' }
          }
        },
        Vehiculo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            unidad_nro: { type: 'string', example: 'VOL-01' },
            tipo: { type: 'string', example: 'Volqueta' },
            placa_serie: { type: 'string' },
            marca: { type: 'string' },
            modelo: { type: 'string' },
            anio: { type: 'integer' },
            horometro_acumulado: { type: 'number', format: 'decimal' },
            combustible_actual: { type: 'string' },
            activo: { type: 'boolean' },
            observaciones: { type: 'string' }
          }
        },
        Jornada: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            usuario_id: { type: 'integer' },
            vehiculo_id: { type: 'integer' },
            estado: { type: 'string', enum: ['activa', 'cerrada', 'cancelada'] },
            fecha_inicio: { type: 'string', format: 'date' },
            capital_recibido: { type: 'number', format: 'decimal' },
            saldo_final: { type: 'number', format: 'decimal' }
          }
        },
        CreateUsuarioRequest: {
          type: 'object',
          required: ['nombre', 'email', 'password', 'rol_id'],
          properties: {
            nombre: { type: 'string', example: 'Juan Perez' },
            email: { type: 'string', format: 'email', example: 'juan@example.com' },
            password: { type: 'string', example: 'SecurePass123' },
            rol_id: { type: 'integer', example: 2 }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'array',
              items: { type: 'object' }
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
                hasNextPage: { type: 'boolean' },
                hasPreviousPage: { type: 'boolean' }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    path.join(__dirname, './swagger-routes.js'),
    path.join(__dirname, '../routes/index.js'),
    path.join(__dirname, '../controllers/*.js')
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
