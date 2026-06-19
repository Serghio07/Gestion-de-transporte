import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Usuario, UsuarioPayload, UsuariosService } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [ButtonModule, CheckboxModule, CommonModule, ConfirmDialogModule, DialogModule, InputTextModule, PaginatorModule, ReactiveFormsModule, TableModule, TagModule],
  providers: [ConfirmationService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  private readonly service = inject(UsuariosService);
  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);
  usuarios: Usuario[] = []; loading = false; saving = false; visible = false; editing: Usuario | null = null; page = 1; limit = 10; total = 0;
  readonly form = this.fb.nonNullable.group({ nombre: ['', Validators.required], apellido: [''], telefono: ['', Validators.required], email: [''], foto_url: [''], password: [''], rol_id: [2], activo: [true] });
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.service.list(this.page, this.limit).subscribe({ next: r => { this.usuarios = r.data; this.total = r.pagination?.total || r.data.length; this.loading = false; }, error: () => this.loading = false }); }
  paginate(e: PaginatorState): void { this.page = (e.page ?? 0) + 1; this.limit = e.rows ?? 10; this.load(); }
  roleName(id: number): string { return ({ 1: 'Administrador', 2: 'Trabajador', 3: 'Supervisor' } as Record<number, string>)[id] || `Rol ${id}`; }
  open(u?: Usuario): void { this.editing = u || null; this.form.reset({ nombre: u?.nombre || '', apellido: u?.apellido || '', telefono: u?.telefono || '', email: u?.email || '', foto_url: u?.foto_url || '', password: '', rol_id: u?.rol_id || 2, activo: u?.activo ?? true }); this.visible = true; }
  save(): void {
    const v = this.form.getRawValue();
    if (this.form.invalid || (!this.editing && v.password.length < 8)) { this.messages.add({ severity: 'warn', summary: 'Revisa el formulario', detail: 'La contraseña debe tener al menos 8 caracteres' }); return; }
    const payload: UsuarioPayload = { nombre: v.nombre, apellido: v.apellido || null, telefono: v.telefono, email: v.email || null, foto_url: v.foto_url || null, rol_id: v.rol_id, estado: v.activo ? 'activo' : 'inactivo' };
    if (v.password) payload.password = v.password;
    this.saving = true;
    (this.editing ? this.service.update(this.editing.id, payload) : this.service.create(payload)).subscribe({ next: () => { this.saving = false; this.visible = false; this.load(); this.messages.add({ severity: 'success', summary: 'Usuario guardado' }); }, error: (e: HttpErrorResponse) => { this.saving = false; this.messages.add({ severity: 'error', summary: 'No se pudo guardar', detail: e.error?.error?.message || 'Error' }); } });
  }
  remove(u: Usuario): void { this.confirmation.confirm({ header: 'Eliminar usuario', message: `¿Eliminar a ${u.nombre}?`, acceptLabel: 'Eliminar', rejectLabel: 'Cancelar', acceptButtonStyleClass: 'p-button-danger', accept: () => this.service.delete(u.id).subscribe(() => this.load()) }); }
}
