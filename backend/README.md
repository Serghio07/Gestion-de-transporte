# Sistema de Gestión de Transporte y Construcción - Backend

Backend REST API desarrollado con Node.js, Express y PostgreSQL para gestionar transporte, vehículos, jornadas, gastos y mantenimiento.

## Características

- ✅ Autenticación y autorización con JWT
- ✅ Gestión de usuarios, roles y permisos
- ✅ Control de vehículos y flota
- ✅ Registro de jornadas diarias
- ✅ Inspección técnica (checklist diario)
- ✅ Registro de gastos y actividades
- ✅ Mantenimiento preventivo
- ✅ Reportes de averías
- ✅ API RESTful completa

## Estructura del Proyecto

```
backend/
├── src/
│   ├── index.js                 # Archivo principal
│   ├── models/                  # Modelos Sequelize
│   │   ├── Role.js
│   │   ├── Usuario.js
│   │   ├── Vehiculo.js
│   │   ├── Jornada.js
│   │   ├── ChecklistDiario.js
│   │   ├── ActividadGasto.js
│   │   ├── MantenimientoVidaUtil.js
│   │   ├── ReporteAveria.js
│   │   └── index.js
│   ├── routes/                  # Rutas API
│   │   └── index.js
│   ├── controllers/             # Controladores de lógica
│   │   ├── roleController.js
│   │   ├── usuarioController.js
│   │   ├── vehiculoController.js
│   │   ├── jornadaController.js
│   │   ├── checklistController.js
│   │   ├── actividadController.js
│   │   ├── mantenimientoController.js
│   │   └── reporteAveriaController.js
│   ├── middleware/              # Middleware personalizado
│   │   ├── authMiddleware.js
│   │   └── errorHandler.js
│   ├── config/                  # Configuración
│   │   ├── sequelize.js
│   │   └── database.js
│   └── utils/                   # Funciones auxiliares
│       └── helpers.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Instalación

### Requisitos
- Node.js (v14+)
- PostgreSQL (v12+)

### Pasos

1. **Clonar o acceder al proyecto**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
```

**Contenido de .env:**
```
PORT=3000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestion_transporte
DB_USER=postgres
DB_PASSWORD=tu_password

# JWT
JWT_SECRET=tu_clave_secreta_aqui
```

4. **Crear base de datos en PostgreSQL**
```sql
CREATE DATABASE gestion_transporte;
```

5. **Ejecutar el servidor**

**Desarrollo (con nodemon):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## Endpoints API

### Autenticación
- `POST /api/usuarios/login` - Login de usuario

### Roles
- `GET /api/roles` - Obtener todos los roles
- `POST /api/roles` - Crear nuevo rol
- `GET /api/roles/:id` - Obtener rol por ID
- `PUT /api/roles/:id` - Actualizar rol
- `DELETE /api/roles/:id` - Eliminar rol

### Usuarios
- `GET /api/usuarios` - Obtener todos los usuarios
- `POST /api/usuarios` - Crear nuevo usuario
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Vehículos
- `GET /api/vehiculos` - Obtener todos los vehículos
- `POST /api/vehiculos` - Crear nuevo vehículo
- `GET /api/vehiculos/:id` - Obtener vehículo por ID
- `PUT /api/vehiculos/:id` - Actualizar vehículo
- `DELETE /api/vehiculos/:id` - Eliminar vehículo

### Jornadas
- `GET /api/jornadas` - Obtener todas las jornadas
- `POST /api/jornadas` - Crear nueva jornada
- `GET /api/jornadas/:id` - Obtener jornada por ID
- `PUT /api/jornadas/:id/cerrar` - Cerrar jornada
- `GET /api/usuarios/:usuario_id/jornadas` - Obtener jornadas de un usuario
- `DELETE /api/jornadas/:id` - Eliminar jornada

### Checklist Diario
- `GET /api/checklists` - Obtener todos los checklists
- `POST /api/checklists` - Crear nuevo checklist
- `GET /api/checklists/:id` - Obtener checklist por ID
- `PUT /api/checklists/:id` - Actualizar checklist
- `DELETE /api/checklists/:id` - Eliminar checklist

### Actividades/Gastos
- `GET /api/actividades` - Obtener todas las actividades
- `POST /api/actividades` - Crear nueva actividad
- `GET /api/actividades/:id` - Obtener actividad por ID
- `GET /api/jornadas/:jornada_id/actividades` - Obtener actividades de una jornada
- `PUT /api/actividades/:id` - Actualizar actividad
- `DELETE /api/actividades/:id` - Eliminar actividad

### Mantenimiento
- `GET /api/mantenimientos` - Obtener todos los mantenimientos
- `POST /api/mantenimientos` - Crear nuevo mantenimiento
- `GET /api/mantenimientos/:id` - Obtener mantenimiento por ID
- `GET /api/vehiculos/:vehiculo_id/mantenimientos` - Obtener mantenimientos de un vehículo
- `PUT /api/mantenimientos/:id` - Actualizar mantenimiento
- `DELETE /api/mantenimientos/:id` - Eliminar mantenimiento

### Reportes de Averías
- `GET /api/averias` - Obtener todos los reportes
- `POST /api/averias` - Crear nuevo reporte
- `GET /api/averias/:id` - Obtener reporte por ID
- `GET /api/jornadas/:jornada_id/averias` - Obtener averías de una jornada
- `PUT /api/averias/:id` - Actualizar reporte
- `DELETE /api/averias/:id` - Eliminar reporte

## Ejemplo de Uso

### 1. Crear un usuario
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "rol_id": 1,
    "password": "password123",
    "pin_acceso": "123456"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "password": "password123"
  }'
```

### 3. Crear vehículo
```bash
curl -X POST http://localhost:3000/api/vehiculos \
  -H "Content-Type: application/json" \
  -d '{
    "unidad_nro": "VOL-01",
    "tipo": "Volqueta",
    "placa_serie": "ABC123",
    "horometro_acumulado": 1500
  }'
```

### 4. Crear jornada
```bash
curl -X POST http://localhost:3000/api/jornadas \
  -H "Content-Type: application/json" \
  -d '{
    "usuario_id": 1,
    "vehiculo_id": 1,
    "capital_recibido": 5000,
    "viaticos_entregados": 1000,
    "diesel_inicial_nivel": "3/4"
  }'
```

## Dependencias

- **express** - Framework web
- **sequelize** - ORM para PostgreSQL
- **pg** - Driver PostgreSQL
- **bcryptjs** - Encriptación de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **dotenv** - Variables de entorno
- **cors** - Control de CORS

## Desarrollo

### Scripts disponibles
- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor con nodemon (desarrollo)
- `npm test` - Ejecuta pruebas

## Estructura de Respuestas

### Éxito (200)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Error (400/500)
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto del servidor | 3000 |
| NODE_ENV | Entorno | development |
| DB_HOST | Host de PostgreSQL | localhost |
| DB_PORT | Puerto de PostgreSQL | 5432 |
| DB_NAME | Nombre de la BD | gestion_transporte |
| DB_USER | Usuario de PostgreSQL | postgres |
| DB_PASSWORD | Contraseña de PostgreSQL | password |
| JWT_SECRET | Clave secreta JWT | secret_key |

## Licencia

ISC

## Autor

Sistema de Gestión de Transporte y Construcción

