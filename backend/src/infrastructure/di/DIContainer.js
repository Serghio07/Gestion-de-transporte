// Infrastructure - Dependency Injection Container

class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  register(name, definition, options = {}) {
    this.services.set(name, {
      definition,
      singleton: options.singleton || false
    });
  }

  get(name) {
    if (!this.services.has(name)) {
      throw new Error(`Service "${name}" not found in DI container`);
    }

    const service = this.services.get(name);

    if (service.singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, service.definition());
      }
      return this.singletons.get(name);
    }

    return service.definition();
  }

  has(name) {
    return this.services.has(name);
  }

  clear() {
    this.services.clear();
    this.singletons.clear();
  }
}

function setupDIContainer(db) {
  const container = new DIContainer();

  // =====================================
  // REPOSITORIES
  // =====================================
  const UsuarioRepositoryImpl = require('../persistence/UsuarioRepositoryImpl');
  const VehiculoRepositoryImpl = require('../persistence/VehiculoRepositoryImpl');
  const JornadaRepositoryImpl = require('../persistence/JornadaRepositoryImpl');
  const RoleRepositoryImpl = require('../persistence/RoleRepositoryImpl');
  const ChecklistRepositoryImpl = require('../persistence/ChecklistRepositoryImpl');
  const ActividadRepositoryImpl = require('../persistence/ActividadRepositoryImpl');
  const ReporteRepositoryImpl = require('../persistence/ReporteRepositoryImpl');
  const MantenimientoRepositoryImpl = require('../persistence/MantenimientoRepositoryImpl');

  container.register('UsuarioRepository', () => new UsuarioRepositoryImpl(db), { singleton: true });
  container.register('VehiculoRepository', () => new VehiculoRepositoryImpl(db), { singleton: true });
  container.register('JornadaRepository', () => new JornadaRepositoryImpl(db), { singleton: true });
  container.register('RoleRepository', () => new RoleRepositoryImpl(db), { singleton: true });
  container.register('ChecklistRepository', () => new ChecklistRepositoryImpl(db), { singleton: true });
  container.register('ActividadRepository', () => new ActividadRepositoryImpl(db), { singleton: true });
  container.register('ReporteRepository', () => new ReporteRepositoryImpl(db), { singleton: true });
  container.register('MantenimientoRepository', () => new MantenimientoRepositoryImpl(db), { singleton: true });

  // =====================================
  // USE CASES - USUARIOS
  // =====================================
  const {
    CreateUsuarioUseCase,
    GetAllUsuariosUseCase,
    GetUsuarioByIdUseCase,
    UpdateUsuarioUseCase,
    DeleteUsuarioUseCase,
    LoginUseCase
  } = require('../../application/usecases/usuario.usecases');

  container.register('CreateUsuarioUseCase', () => 
    new CreateUsuarioUseCase(container.get('UsuarioRepository'))
  );
  container.register('GetAllUsuariosUseCase', () => 
    new GetAllUsuariosUseCase(container.get('UsuarioRepository'))
  );
  container.register('GetUsuarioByIdUseCase', () => 
    new GetUsuarioByIdUseCase(container.get('UsuarioRepository'))
  );
  container.register('UpdateUsuarioUseCase', () => 
    new UpdateUsuarioUseCase(container.get('UsuarioRepository'))
  );
  container.register('DeleteUsuarioUseCase', () => 
    new DeleteUsuarioUseCase(container.get('UsuarioRepository'))
  );
  container.register('LoginUseCase', () => 
    new LoginUseCase(container.get('UsuarioRepository'))
  );

  // =====================================
  // USE CASES - VEHICULOS
  // =====================================
  const {
    CreateVehiculoUseCase,
    GetAllVehiculosUseCase,
    GetVehiculoByIdUseCase,
    UpdateVehiculoUseCase,
    DeleteVehiculoUseCase
  } = require('../../application/usecases/vehiculo.usecases');

  container.register('CreateVehiculoUseCase', () => 
    new CreateVehiculoUseCase(container.get('VehiculoRepository'))
  );
  container.register('GetAllVehiculosUseCase', () => 
    new GetAllVehiculosUseCase(container.get('VehiculoRepository'))
  );
  container.register('GetVehiculoByIdUseCase', () => 
    new GetVehiculoByIdUseCase(container.get('VehiculoRepository'))
  );
  container.register('UpdateVehiculoUseCase', () => 
    new UpdateVehiculoUseCase(container.get('VehiculoRepository'))
  );
  container.register('DeleteVehiculoUseCase', () => 
    new DeleteVehiculoUseCase(container.get('VehiculoRepository'))
  );

  // =====================================
  // USE CASES - JORNADAS
  // =====================================
  const {
    CreateJornadaUseCase,
    GetAllJornadasUseCase,
    GetJornadaByIdUseCase,
    UpdateJornadaUseCase,
    DeleteJornadaUseCase
  } = require('../../application/usecases/jornada.usecases');

  container.register('CreateJornadaUseCase', () => 
    new CreateJornadaUseCase(
      container.get('JornadaRepository'),
      container.get('UsuarioRepository'),
      container.get('VehiculoRepository')
    )
  );
  container.register('GetAllJornadasUseCase', () => 
    new GetAllJornadasUseCase(container.get('JornadaRepository'))
  );
  container.register('GetJornadaByIdUseCase', () => 
    new GetJornadaByIdUseCase(container.get('JornadaRepository'))
  );
  container.register('UpdateJornadaUseCase', () => 
    new UpdateJornadaUseCase(container.get('JornadaRepository'))
  );
  container.register('DeleteJornadaUseCase', () => 
    new DeleteJornadaUseCase(container.get('JornadaRepository'))
  );

  // =====================================
  // USE CASES - ROLES
  // =====================================
  const {
    CreateRoleUseCase,
    GetAllRolesUseCase,
    GetRoleByIdUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase
  } = require('../../application/usecases/role.usecases');

  container.register('CreateRoleUseCase', () => 
    new CreateRoleUseCase(container.get('RoleRepository'))
  );
  container.register('GetAllRolesUseCase', () => 
    new GetAllRolesUseCase(container.get('RoleRepository'))
  );
  container.register('GetRoleByIdUseCase', () => 
    new GetRoleByIdUseCase(container.get('RoleRepository'))
  );
  container.register('UpdateRoleUseCase', () => 
    new UpdateRoleUseCase(container.get('RoleRepository'))
  );
  container.register('DeleteRoleUseCase', () => 
    new DeleteRoleUseCase(container.get('RoleRepository'))
  );

  // =====================================
  // USE CASES - CHECKLISTS
  // =====================================
  const {
    CreateChecklistUseCase,
    GetAllChecklistsUseCase,
    GetChecklistByIdUseCase,
    UpdateChecklistUseCase,
    DeleteChecklistUseCase
  } = require('../../application/usecases/checklist.usecases');

  container.register('CreateChecklistUseCase', () => 
    new CreateChecklistUseCase(
      container.get('ChecklistRepository'),
      container.get('JornadaRepository')
    )
  );
  container.register('GetAllChecklistsUseCase', () => 
    new GetAllChecklistsUseCase(container.get('ChecklistRepository'))
  );
  container.register('GetChecklistByIdUseCase', () => 
    new GetChecklistByIdUseCase(container.get('ChecklistRepository'))
  );
  container.register('UpdateChecklistUseCase', () => 
    new UpdateChecklistUseCase(container.get('ChecklistRepository'))
  );
  container.register('DeleteChecklistUseCase', () => 
    new DeleteChecklistUseCase(container.get('ChecklistRepository'))
  );

  // =====================================
  // USE CASES - ACTIVIDADES
  // =====================================
  const {
    CreateActividadUseCase,
    GetAllActividadesUseCase,
    GetActividadByIdUseCase,
    UpdateActividadUseCase,
    DeleteActividadUseCase
  } = require('../../application/usecases/actividad.usecases');

  container.register('CreateActividadUseCase', () => 
    new CreateActividadUseCase(
      container.get('ActividadRepository'),
      container.get('JornadaRepository')
    )
  );
  container.register('GetAllActividadesUseCase', () => 
    new GetAllActividadesUseCase(container.get('ActividadRepository'))
  );
  container.register('GetActividadByIdUseCase', () => 
    new GetActividadByIdUseCase(container.get('ActividadRepository'))
  );
  container.register('UpdateActividadUseCase', () => 
    new UpdateActividadUseCase(container.get('ActividadRepository'))
  );
  container.register('DeleteActividadUseCase', () => 
    new DeleteActividadUseCase(container.get('ActividadRepository'))
  );

  // =====================================
  // USE CASES - MANTENIMIENTOS
  // =====================================
  const {
    CreateMantenimientoUseCase,
    GetAllMantenimientosUseCase,
    GetMantenimientoByIdUseCase,
    UpdateMantenimientoUseCase,
    DeleteMantenimientoUseCase
  } = require('../../application/usecases/mantenimiento.usecases');

  container.register('CreateMantenimientoUseCase', () =>
    new CreateMantenimientoUseCase(
      container.get('MantenimientoRepository'),
      container.get('VehiculoRepository')
    )
  );
  container.register('GetAllMantenimientosUseCase', () =>
    new GetAllMantenimientosUseCase(container.get('MantenimientoRepository'))
  );
  container.register('GetMantenimientoByIdUseCase', () =>
    new GetMantenimientoByIdUseCase(container.get('MantenimientoRepository'))
  );
  container.register('UpdateMantenimientoUseCase', () =>
    new UpdateMantenimientoUseCase(container.get('MantenimientoRepository'))
  );
  container.register('DeleteMantenimientoUseCase', () =>
    new DeleteMantenimientoUseCase(container.get('MantenimientoRepository'))
  );

  // =====================================
  // USE CASES - REPORTES
  // =====================================
  const {
    CreateReporteUseCase,
    GetAllReportesUseCase,
    GetReporteByIdUseCase,
    UpdateReporteUseCase,
    DeleteReporteUseCase
  } = require('../../application/usecases/reporte.usecases');

  container.register('CreateReporteUseCase', () => 
    new CreateReporteUseCase(
      container.get('ReporteRepository'),
      container.get('JornadaRepository')
    )
  );
  container.register('GetAllReportesUseCase', () => 
    new GetAllReportesUseCase(container.get('ReporteRepository'))
  );
  container.register('GetReporteByIdUseCase', () => 
    new GetReporteByIdUseCase(container.get('ReporteRepository'))
  );
  container.register('UpdateReporteUseCase', () => 
    new UpdateReporteUseCase(container.get('ReporteRepository'))
  );
  container.register('DeleteReporteUseCase', () => 
    new DeleteReporteUseCase(container.get('ReporteRepository'))
  );

  return container;
}

module.exports = {
  DIContainer,
  setupDIContainer
};
