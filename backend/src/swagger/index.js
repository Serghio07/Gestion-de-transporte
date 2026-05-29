// Swagger/OpenAPI configuration

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gestión de Transporte',
      version: '2.0.0',
      description: 'API de gestion de transporte con autenticacion JWT, vehiculos, jornadas, gastos, mantenimiento, reportes y auditoria',
      contact: {
        name: 'Soporte API',
        email: 'support@gestiontransporte.com'
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
        url: 'https://api.gestiontransporte.com',
        description: 'Servidor de Producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido del endpoint /api/auth/login'
        }
      },
      schemas: {
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            pages: { type: 'integer' },
            hasMore: { type: 'boolean' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            apellido: { type: 'string', nullable: true },
            telefono: { type: 'string', nullable: true },
            empresa_id: { type: 'integer', nullable: true },
            rol_id: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Empresa: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            telefono: { type: 'string', nullable: true },
            activo: { type: 'boolean' },
            creado_por_id: { type: 'integer', nullable: true },
            creado_en: { type: 'string', format: 'date-time' },
            actualizado_en: { type: 'string', format: 'date-time' }
          }
        },
        Vehiculo: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            unidad_nro: { type: 'string' },
            tipo: { type: 'string' },
            placa_serie: { type: 'string' },
            marca: { type: 'string' },
            modelo: { type: 'string' },
            anio: { type: 'integer' },
            estado: { type: 'string', enum: ['activo', 'inactivo', 'mantenimiento'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Jornada: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            usuario_id: { type: 'integer' },
            vehiculo_id: { type: 'integer' },
            fecha_inicio: { type: 'string', format: 'date-time' },
            fecha_fin: { type: 'string', format: 'date-time' },
            estado: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Role: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            permisos: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ChecklistDiario: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            jornada_id: { type: 'integer' },
            item_nro: { type: 'integer' },
            descripcion: { type: 'string' },
            estado_verificacion: { type: 'string' },
            observaciones: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ActividadGasto: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            jornada_id: { type: 'integer' },
            descripcion: { type: 'string' },
            tipo: { type: 'string' },
            monto: { type: 'number' },
            fecha_registro: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        MantenimientoVidaUtil: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            vehiculo_id: { type: 'integer' },
            tipo_mantenimiento: { type: 'string' },
            descripcion: { type: 'string' },
            fecha_inicio: { type: 'string', format: 'date-time' },
            fecha_fin: { type: 'string', format: 'date-time' },
            horometro_realizado: { type: 'number' },
            costo: { type: 'number' },
            proveedor: { type: 'string' },
            estado: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        ReporteAveria: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            jornada_id: { type: 'integer' },
            descripcion: { type: 'string' },
            severidad: { type: 'string', enum: ['baja', 'media', 'alta', 'critica'] },
            area_afectada: { type: 'string' },
            fecha_reporte: { type: 'string', format: 'date-time' },
            fecha_resolucion: { type: 'string', format: 'date-time' },
            estado: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        LoginRequest: {
          type: 'object',
          properties: {
            telefono: { type: 'string', example: '+59170000000' },
            password: { type: 'string' }
          },
          required: ['telefono', 'password']
        },
        RegisterRequest: {
          type: 'object',
          required: ['telefono', 'password', 'confirmPassword'],
          properties: {
            telefono: { type: 'string', example: '+59170000000' },
            password: { type: 'string', format: 'password' },
            confirmPassword: { type: 'string', format: 'password' }
          }
        },
        VerifyPhoneRequest: {
          type: 'object',
          required: ['telefono', 'codigo'],
          properties: {
            telefono: { type: 'string', example: '+59170000000' },
            codigo: { type: 'string', example: '123456' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            usuario: { $ref: '#/components/schemas/Usuario' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' }
          }
        }
      }
    },
    tags: [
      { name: 'Autenticación', description: 'Endpoints para login y autenticación' },
      { name: 'Usuarios', description: 'Gestión de usuarios del sistema' },
      { name: 'Empresas', description: 'Gestion de empresas creadas por administradores' },
      { name: 'Vehículos', description: 'Gestión de vehículos' },
      { name: 'Jornadas', description: 'Gestión de jornadas de trabajo' },
      { name: 'Roles', description: 'Gestión de roles y permisos' },
      { name: 'Checklists', description: 'Checklists diarios de vehículos' },
      { name: 'Actividades', description: 'Registro de actividades y gastos' },
      { name: 'Mantenimientos', description: 'Gestión de mantenimiento de vehículos' },
      { name: 'Reportes', description: 'Reportes PDF del sistema' },
      { name: 'Anticipos', description: 'Anticipos asociados a jornadas' },
      { name: 'Alertas', description: 'Alertas de mantenimiento' },
      { name: 'Auditoria', description: 'Historial de cambios auditado por base de datos' },
      { name: 'Sesiones', description: 'Sesiones activas del sistema' }
    ]
  },
  apis: [
    './src/interfaces/http/routes/auth.js',
    './src/interfaces/http/routes/usuarios.js',
    './src/interfaces/http/routes/empresas.js',
    './src/interfaces/http/routes/vehiculos.js',
    './src/interfaces/http/routes/jornadas.js',
    './src/interfaces/http/routes/roles.js',
    './src/interfaces/http/routes/checklists.js',
    './src/interfaces/http/routes/actividades.js',
    './src/interfaces/http/routes/mantenimientos.js',
    './src/interfaces/http/routes/reportes.js',
    './src/interfaces/http/routes/anticipos.js',
    './src/interfaces/http/routes/alertasMantenimiento.js',
    './src/interfaces/http/routes/historialCambios.js',
    './src/interfaces/http/routes/sesiones.js'
  ]
};
const specs = swaggerJsdoc(options);

module.exports = specs;
