export interface Vehiculo {
  id: number;
  unidad_nro: string;
  tipo: string;
  placa_serie: string | null;
  marca: string | null;
  modelo: string | null;
  foto_url: string | null;
  uso_total_horas: string;
  activo: boolean;
  conductor_id: number | null;
  conductor?: { id: number; nombre: string; apellido: string | null } | null;
  creado_en: string;
  actualizado_en: string;
}

export interface VehiculoPayload {
  unidad_nro: string;
  tipo: string;
  placa_serie: string | null;
  marca: string | null;
  modelo: string | null;
  foto_url: string | null;
  activo: boolean;
  conductor_id: number | null;
  uso_total_horas?: string;
}

export interface VehiculoListResponse {
  success: boolean;
  data: Vehiculo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
  };
}

export interface VehiculoResponse {
  success: boolean;
  data: Vehiculo;
}
