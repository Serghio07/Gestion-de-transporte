import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string | null;
  email: string | null;
  telefono: string;
  foto_url: string | null;
  rol_id: number;
  activo: boolean;
  role?: { id: number; nombre: string };
  empresa?: { id: number; nombre: string };
}

export interface UsuarioPayload {
  nombre: string;
  apellido?: string | null;
  email?: string | null;
  telefono: string;
  foto_url?: string | null;
  password?: string;
  rol_id: number;
  estado: 'activo' | 'inactivo';
}

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  constructor(private readonly http: HttpClient) {}
  list(page: number, limit: number) {
    return this.http.get<any>('/api/usuarios', { params: new HttpParams().set('page', page).set('limit', limit) });
  }
  create(payload: UsuarioPayload) { return this.http.post<any>('/api/usuarios', payload); }
  update(id: number, payload: UsuarioPayload) { return this.http.put<any>(`/api/usuarios/${id}`, payload); }
  delete(id: number) { return this.http.delete<any>(`/api/usuarios/${id}`); }
}
