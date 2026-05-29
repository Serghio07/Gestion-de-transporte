// Dependency Injection Container

const { Usuario, Vehiculo, Jornada, Role, TokenBlacklist } = require('./infrastructure/persistence');

// Infrastructure - Repositories
const { UsuarioRepository, VehiculoRepository, JornadaRepository, RoleRepository } = require('./infrastructure/repositories');
const ChecklistRepositoryImpl = require('./infrastructure/persistence/ChecklistRepositoryImpl');
const ActividadRepositoryImpl = require('./infrastructure/persistence/ActividadRepositoryImpl');
const ReporteRepositoryImpl = require('./infrastructure/persistence/ReporteRepositoryImpl');
const { AuthService, EmailService, SmsService, WhatsAppService, CacheService } = require('./infrastructure/external');

// Application - Use Cases Usuario
const {
  LoginUseCase,
  CreateUsuarioUseCase,
  GetAllUsuariosUseCase,
  GetUsuarioByIdUseCase,
  UpdateUsuarioUseCase,
  DeleteUsuarioUseCase
} = require('./application/usecases/usuario.usecases');

// Application - Use Cases Vehiculo
const {
  CreateVehiculoUseCase,
  GetAllVehiculosUseCase,
  GetVehiculoByIdUseCase,
  UpdateVehiculoUseCase,
  DeleteVehiculoUseCase
} = require('./application/usecases/vehiculo.usecases');

// Application - Use Cases Jornada
const {
  CreateJornadaUseCase,
  GetAllJornadasUseCase,
  GetJornadaByIdUseCase,
  UpdateJornadaUseCase,
  DeleteJornadaUseCase,
  FinalizarJornadaUseCase
} = require('./application/usecases/jornada.usecases');

// Application - Use Cases Role
const {
  CreateRoleUseCase,
  GetAllRolesUseCase,
  GetRoleByIdUseCase,
  UpdateRoleUseCase,
  DeleteRoleUseCase
} = require('./application/usecases/role.usecases');

// Application - Use Cases Checklist
const {
  CreateChecklistUseCase,
  GetAllChecklistsUseCase,
  GetChecklistByIdUseCase,
  UpdateChecklistUseCase,
  DeleteChecklistUseCase
} = require('./application/usecases/checklist.usecases');

// Application - Use Cases Actividad
const {
  CreateActividadUseCase,
  GetAllActividadesUseCase,
  GetActividadByIdUseCase,
  UpdateActividadUseCase,
  DeleteActividadUseCase
} = require('./application/usecases/actividad.usecases');

// Application - Use Cases Reporte
const {
  CreateReporteUseCase,
  GetAllReportesUseCase,
  GetReporteByIdUseCase,
  UpdateReporteUseCase,
  DeleteReporteUseCase
} = require('./application/usecases/reporte.usecases');

// Interfaces - Controllers
const { UsuarioController } = require('./interfaces/http/controllers');
const AuthController = require('./interfaces/http/controllers/authController');
const VehiculoController = require('./interfaces/http/controllers/VehiculoController');
const JornadaController = require('./interfaces/http/controllers/JornadaController');
const RoleController = require('./interfaces/http/controllers/RoleController');
const ChecklistController = require('./interfaces/http/controllers/ChecklistController');
const ActividadController = require('./interfaces/http/controllers/ActividadController');
const ReporteController = require('./interfaces/http/controllers/ReporteController');

class Container {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.setupRepositories();
    this.setupServices();
    this.setupUseCases();
    this.setupControllers();
  }

  setupRepositories() {
    this.register('usuarioRepository', () => new UsuarioRepository(Usuario), true);
    this.register('vehiculoRepository', () => new VehiculoRepository(Vehiculo), true);
    this.register('jornadaRepository', () => new JornadaRepository(Jornada), true);
    this.register('roleRepository', () => new RoleRepository(Role), true);
    this.register('checklistRepository', () => new ChecklistRepositoryImpl(), true);
    this.register('actividadRepository', () => new ActividadRepositoryImpl(), true);
    this.register('reporteRepository', () => new ReporteRepositoryImpl(), true);
  }

  setupServices() {
    this.register('authService', () => new AuthService(
      process.env.NODE_ENV === 'test' ? null : TokenBlacklist
    ), true);
    this.register('emailService', () => new EmailService(null), true);
    this.register('smsService', () => new SmsService(), true);
    this.register('whatsappService', () => new WhatsAppService(), true);
    this.register('cacheService', () => new CacheService(), true);
  }

  setupUseCases() {
    // Usuario Use Cases
    this.register('LoginUseCase', () => new LoginUseCase(
      this.get('usuarioRepository'),
      this.get('authService')
    ));

    this.register('CreateUsuarioUseCase', () => new CreateUsuarioUseCase(
      this.get('usuarioRepository'),
      this.get('authService'),
      this.get('emailService')
    ));

    this.register('GetAllUsuariosUseCase', () => new GetAllUsuariosUseCase(
      this.get('usuarioRepository')
    ));

    this.register('GetUsuarioByIdUseCase', () => new GetUsuarioByIdUseCase(
      this.get('usuarioRepository')
    ));

    this.register('UpdateUsuarioUseCase', () => new UpdateUsuarioUseCase(
      this.get('usuarioRepository')
    ));

    this.register('DeleteUsuarioUseCase', () => new DeleteUsuarioUseCase(
      this.get('usuarioRepository')
    ));

    // Vehiculo Use Cases
    this.register('CreateVehiculoUseCase', () => new CreateVehiculoUseCase(
      this.get('vehiculoRepository')
    ));

    this.register('GetAllVehiculosUseCase', () => new GetAllVehiculosUseCase(
      this.get('vehiculoRepository')
    ));

    this.register('GetVehiculoByIdUseCase', () => new GetVehiculoByIdUseCase(
      this.get('vehiculoRepository')
    ));

    this.register('UpdateVehiculoUseCase', () => new UpdateVehiculoUseCase(
      this.get('vehiculoRepository')
    ));

    this.register('DeleteVehiculoUseCase', () => new DeleteVehiculoUseCase(
      this.get('vehiculoRepository')
    ));

    // Jornada Use Cases
    this.register('CreateJornadaUseCase', () => new CreateJornadaUseCase(
      this.get('jornadaRepository')
    ));

    this.register('GetAllJornadasUseCase', () => new GetAllJornadasUseCase(
      this.get('jornadaRepository')
    ));

    this.register('GetJornadaByIdUseCase', () => new GetJornadaByIdUseCase(
      this.get('jornadaRepository')
    ));

    this.register('UpdateJornadaUseCase', () => new UpdateJornadaUseCase(
      this.get('jornadaRepository')
    ));

    this.register('DeleteJornadaUseCase', () => new DeleteJornadaUseCase(
      this.get('jornadaRepository')
    ));

    this.register('FinalizarJornadaUseCase', () => new FinalizarJornadaUseCase(
      this.get('jornadaRepository')
    ));

    // Role Use Cases
    this.register('CreateRoleUseCase', () => new CreateRoleUseCase(
      this.get('roleRepository')
    ));

    this.register('GetAllRolesUseCase', () => new GetAllRolesUseCase(
      this.get('roleRepository')
    ));

    this.register('GetRoleByIdUseCase', () => new GetRoleByIdUseCase(
      this.get('roleRepository')
    ));

    this.register('UpdateRoleUseCase', () => new UpdateRoleUseCase(
      this.get('roleRepository')
    ));

    this.register('DeleteRoleUseCase', () => new DeleteRoleUseCase(
      this.get('roleRepository')
    ));

    // Checklist Use Cases
    this.register('CreateChecklistUseCase', () => new CreateChecklistUseCase(
      this.get('checklistRepository')
    ));

    this.register('GetAllChecklistsUseCase', () => new GetAllChecklistsUseCase(
      this.get('checklistRepository')
    ));

    this.register('GetChecklistByIdUseCase', () => new GetChecklistByIdUseCase(
      this.get('checklistRepository')
    ));

    this.register('UpdateChecklistUseCase', () => new UpdateChecklistUseCase(
      this.get('checklistRepository')
    ));

    this.register('DeleteChecklistUseCase', () => new DeleteChecklistUseCase(
      this.get('checklistRepository')
    ));

    // Actividad Use Cases
    this.register('CreateActividadUseCase', () => new CreateActividadUseCase(
      this.get('actividadRepository')
    ));

    this.register('GetAllActividadesUseCase', () => new GetAllActividadesUseCase(
      this.get('actividadRepository')
    ));

    this.register('GetActividadByIdUseCase', () => new GetActividadByIdUseCase(
      this.get('actividadRepository')
    ));

    this.register('UpdateActividadUseCase', () => new UpdateActividadUseCase(
      this.get('actividadRepository')
    ));

    this.register('DeleteActividadUseCase', () => new DeleteActividadUseCase(
      this.get('actividadRepository')
    ));

    // Reporte Use Cases
    this.register('CreateReporteUseCase', () => new CreateReporteUseCase(
      this.get('reporteRepository')
    ));

    this.register('GetAllReportesUseCase', () => new GetAllReportesUseCase(
      this.get('reporteRepository')
    ));

    this.register('GetReporteByIdUseCase', () => new GetReporteByIdUseCase(
      this.get('reporteRepository')
    ));

    this.register('UpdateReporteUseCase', () => new UpdateReporteUseCase(
      this.get('reporteRepository')
    ));

    this.register('DeleteReporteUseCase', () => new DeleteReporteUseCase(
      this.get('reporteRepository')
    ));
  }

  setupControllers() {
    const container = this;

    this.register('usuarioController', () => new UsuarioController(
      this.get('CreateUsuarioUseCase'),
      this.get('GetAllUsuariosUseCase'),
      this.get('GetUsuarioByIdUseCase'),
      this.get('UpdateUsuarioUseCase'),
      this.get('DeleteUsuarioUseCase')
    ), true);

    this.register('authController', () => AuthController, true);

    this.register('vehiculoController', () => new VehiculoController(container), true);

    this.register('jornadaController', () => new JornadaController(container), true);

    this.register('roleController', () => new RoleController(container), true);

    this.register('checklistController', () => new ChecklistController(container), true);

    this.register('actividadController', () => new ActividadController(container), true);

    this.register('reporteController', () => new ReporteController(container), true);
  }

  register(name, factory, isSingleton = false) {
    if (typeof factory !== 'function') {
      throw new Error(`Factory for "${name}" must be a function`);
    }
    this.services.set(name, { factory, isSingleton });
  }

  get(name) {
    const definition = this.services.get(name);
    if (!definition) {
      throw new Error(`Service "${name}" not registered in container`);
    }

    if (definition.isSingleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, definition.factory());
      }
      return this.singletons.get(name);
    }

    return definition.factory();
  }
}

module.exports = new Container();
