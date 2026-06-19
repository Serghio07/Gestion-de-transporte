import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { VehiculoListResponse, VehiculoPayload, VehiculoResponse } from './vehiculo.models';

export interface VehiculoFilters {
  page: number;
  limit: number;
  unidad_nro?: string;
  tipo?: string;
  activo?: boolean;
}

@Injectable({ providedIn: 'root' })
export class VehiculosService {
  private readonly endpoint = '/api/vehiculos';

  constructor(private readonly http: HttpClient) {}

  list(filters: VehiculoFilters): Observable<VehiculoListResponse> {
    let params = new HttpParams()
      .set('page', filters.page)
      .set('limit', filters.limit);

    if (filters.unidad_nro) params = params.set('unidad_nro', filters.unidad_nro);
    if (filters.tipo) params = params.set('tipo', filters.tipo);
    if (filters.activo !== undefined) params = params.set('activo', filters.activo);

    return this.http.get<VehiculoListResponse>(this.endpoint, { params });
  }

  create(payload: VehiculoPayload): Observable<VehiculoResponse> {
    return this.http.post<VehiculoResponse>(this.endpoint, payload);
  }

  update(id: number, payload: VehiculoPayload): Observable<VehiculoResponse> {
    return this.http.put<VehiculoResponse>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
  }
}
