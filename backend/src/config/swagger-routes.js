/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticación de usuario
 *     description: Login con usuario y contraseña. Retorna tokens JWT.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refrescar token de acceso
 *     description: Obtiene un nuevo token de acceso usando el refresh token
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refrescado
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     description: Invalida el token actual del usuario
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     description: Cambia la contraseña del usuario autenticado
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               passwordActual:
 *                 type: string
 *               passwordNueva:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña cambiada
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Listar todos los usuarios
 *     description: Obtiene la lista de usuarios (requiere admin)
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: activo
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado activo
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 */

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear nuevo usuario
 *     description: Crea un nuevo usuario (requiere admin)
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - password
 *               - rol_id
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: juan_perez
 *               password:
 *                 type: string
 *                 example: SecurePassword123!
 *               rol_id:
 *                 type: integer
 *                 example: 2
 *               email:
 *                 type: string
 *                 format: email
 *               pin_acceso:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */

/**
 * @swagger
 * /api/vehiculos:
 *   get:
 *     summary: Listar vehículos con paginación
 *     tags:
 *       - Vehículos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Registros por página (default 10, max 100)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campo para ordenar (default unidad_nro)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Orden ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista paginada de vehículos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */

/**
 * @swagger
 * /api/vehiculos:
 *   post:
 *     summary: Crear nuevo vehículo
 *     tags:
 *       - Vehículos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - unidad_nro
 *               - tipo
 *             properties:
 *               unidad_nro:
 *                 type: string
 *                 example: VOL-01
 *               tipo:
 *                 type: string
 *                 example: Volqueta
 *               placa_serie:
 *                 type: string
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               anio:
 *                 type: integer
 *               combustible_actual:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vehículo creado
 */

/**
 * @swagger
 * /api/vehiculos/{id}:
 *   get:
 *     summary: Obtener vehículo por ID
 *     tags:
 *       - Vehículos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Datos del vehículo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehiculo'
 */

/**
 * @swagger
 * /api/jornadas:
 *   get:
 *     summary: Listar jornadas
 *     tags:
 *       - Jornadas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jornadas
 */

/**
 * @swagger
 * /api/jornadas:
 *   post:
 *     summary: Crear nueva jornada
 *     tags:
 *       - Jornadas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - vehiculo_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               vehiculo_id:
 *                 type: integer
 *               capital_recibido:
 *                 type: number
 *     responses:
 *       201:
 *         description: Jornada creada
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Listar roles
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear nuevo rol
 *     tags:
 *       - Roles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado
 */

module.exports = {};
