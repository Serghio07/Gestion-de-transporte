// Application - Data Transfer Objects (DTOs)
// Unified index: re-exports all DTOs from individual files

const { CreateUsuarioDTO, UpdateUsuarioDTO } = require('./usuario.dto');
const { CreateVehiculoDTO, UpdateVehiculoDTO } = require('./vehiculo.dto');
const { CreateJornadaDTO, UpdateJornadaDTO } = require('./jornada.dto');
const { CreateChecklistDTO, UpdateChecklistDTO } = require('./checklist.dto');
const { CreateActividadDTO, UpdateActividadDTO } = require('./actividad.dto');
const { CreateMantenimientoDTO, UpdateMantenimientoDTO } = require('./mantenimiento.dto');
const { CreateReporteDTO, UpdateReporteDTO } = require('./reporte.dto');
const { CreateRoleDTO, UpdateRoleDTO, VALID_PERMISSIONS } = require('./role.dto');

module.exports = {
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  CreateVehiculoDTO,
  UpdateVehiculoDTO,
  CreateJornadaDTO,
  UpdateJornadaDTO,
  CreateChecklistDTO,
  UpdateChecklistDTO,
  CreateActividadDTO,
  UpdateActividadDTO,
  CreateMantenimientoDTO,
  UpdateMantenimientoDTO,
  CreateReporteDTO,
  UpdateReporteDTO,
  CreateRoleDTO,
  UpdateRoleDTO,
  VALID_PERMISSIONS
};
