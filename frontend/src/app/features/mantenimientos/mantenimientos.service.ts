import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehiculo, VehiculoListResponse } from '../vehiculos/vehiculo.models';

export interface Mantenimiento {
  id: number;
  vehiculo_id: number;
  fecha_servicio: string;
  tipo_servicio: string;
  observaciones: string | null;
  horometro_servicio: number | null;
  proximo_mantenimiento_h: number | null;
  costo_total: number | null;
  foto_factura_url: string | null;
  vehiculo?: Vehiculo;
}

export interface MantenimientoPayload {
  vehiculo_id?: number;
  fecha_servicio: string;
  tipo_servicio: string;
  observaciones: string | null;
  horometro_servicio: number;
  proximo_mantenimiento_h?: number | null;
  costo_total: number;
  foto_factura_url: string | null;
}

@Injectable({ providedIn: 'root' })
export class MantenimientosService {
  constructor(private readonly http: HttpClient) {}
  list(page: number, limit: number, vehiculoId?: number) {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (vehiculoId) params = params.set('vehiculo_id', vehiculoId);
    return this.http.get<any>('/api/mantenimientos', { params });
  }
  vehicles() { return this.http.get<VehiculoListResponse>('/api/vehiculos', { params: new HttpParams().set('limit', 100) }); }
  create(payload: MantenimientoPayload) { return this.http.post<any>('/api/mantenimientos', payload); }
  update(id: number, payload: MantenimientoPayload) { return this.http.put<any>(`/api/mantenimientos/${id}`, payload); }
  delete(id: number) { return this.http.delete<any>(`/api/mantenimientos/${id}`); }
}
