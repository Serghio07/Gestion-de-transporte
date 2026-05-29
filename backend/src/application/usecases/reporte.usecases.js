// Application - Reporte Use Cases

const { ValidationException, NotFoundException } = require('../../domain/exceptions');

class CreateReporteUseCase {
  constructor(reporteRepository, jornadaRepository) {
    this.reporteRepository = reporteRepository;
    this.jornadaRepository = jornadaRepository;
  }

  async execute(createReporteDTO) {
    if (!createReporteDTO.nombre_archivo) {
      throw new ValidationException('Nombre de archivo es requerido');
    }
    if (!createReporteDTO.fecha_desde || !createReporteDTO.fecha_hasta) {
      throw new ValidationException('Rango de fechas es requerido');
    }

    const reporte = await this.reporteRepository.create(createReporteDTO);
    return reporte;
  }
}

class GetAllReportesUseCase {
  constructor(reporteRepository) {
    this.reporteRepository = reporteRepository;
  }

  async execute(filters, pagination) {
    return await this.reporteRepository.findAll(filters, pagination);
  }
}

class GetReporteByIdUseCase {
  constructor(reporteRepository) {
    this.reporteRepository = reporteRepository;
  }

  async execute(id) {
    const reporte = await this.reporteRepository.findById(id);
    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado');
    }
    return reporte;
  }
}

class UpdateReporteUseCase {
  constructor(reporteRepository) {
    this.reporteRepository = reporteRepository;
  }

  async execute(id, updateReporteDTO) {
    const reporte = await this.reporteRepository.findById(id);
    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado');
    }

    const updated = await this.reporteRepository.update(id, updateReporteDTO);
    return updated;
  }
}

class DeleteReporteUseCase {
  constructor(reporteRepository) {
    this.reporteRepository = reporteRepository;
  }

  async execute(id) {
    const reporte = await this.reporteRepository.findById(id);
    if (!reporte) {
      throw new NotFoundException('Reporte no encontrado');
    }

    const deleted = await this.reporteRepository.delete(id);
    return deleted;
  }
}

module.exports = {
  CreateReporteUseCase,
  GetAllReportesUseCase,
  GetReporteByIdUseCase,
  UpdateReporteUseCase,
  DeleteReporteUseCase
};
