import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Usuario, UsuarioPayload, UsuariosService } from './usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    PaginatorModule,
    PasswordModule,
    ReactiveFormsModule,
    TableModule,
    TagModule
  ],
  providers: [ConfirmationService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private readonly service = inject(UsuariosService);
  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  readonly pageSizeOptions = [5, 10, 20, 50];

  usuarios: Usuario[] = [];
  loading = false;
  saving = false;
  visible = false;
  editing: Usuario | null = null;
  page = 1;
  limit = 10;
  total = 0;
  searchName = '';
  filterRole = '';
  filterStatus = '';

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellido: [''],
    telefono: ['', Validators.required],
    email: [''],
    foto_url: [''],
    password: [''],
    rol_id: [2],
    activo: [true]
  });

  ngOnInit(): void {
    this.load();
  }

  get activeCount(): number {
    return this.usuarios.filter((u) => u.activo).length;
  }

  load(): void {
    this.loading = true;
    this.service.list(this.page, this.limit).subscribe({
      next: (response) => {
        let data: Usuario[] = response.data ?? [];
        const term = this.searchName.trim().toLowerCase();
        if (term) {
          data = data.filter((u) =>
            `${u.nombre} ${u.apellido ?? ''} ${u.telefono} ${u.email ?? ''}`.toLowerCase().includes(term)
          );
        }
        if (this.filterRole) {
          data = data.filter((u) => u.rol_id === Number(this.filterRole));
        }
        if (this.filterStatus !== '') {
          const active = this.filterStatus === 'true';
          data = data.filter((u) => u.activo === active);
        }
        this.usuarios = data;
        this.total = response.pagination?.total ?? data.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  clearFilters(): void {
    this.searchName = '';
    this.filterRole = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  paginate(event: PaginatorState): void {
    this.page = (event.page ?? 0) + 1;
    this.limit = event.rows ?? 10;
    this.load();
  }

  roleName(id: number): string {
    return ({ 1: 'Administrador', 2: 'Trabajador', 3: 'Supervisor' } as Record<number, string>)[id] || `Rol ${id}`;
  }

  roleSeverity(id: number): 'danger' | 'info' | 'warning' | 'secondary' {
    return ({ 1: 'danger', 2: 'info', 3: 'warning' } as Record<number, 'danger' | 'info' | 'warning'>)[id] || 'secondary';
  }

  open(user?: Usuario): void {
    this.editing = user ?? null;
    this.form.reset({
      nombre: user?.nombre ?? '',
      apellido: user?.apellido ?? '',
      telefono: user?.telefono ?? '',
      email: user?.email ?? '',
      foto_url: user?.foto_url ?? '',
      password: '',
      rol_id: user?.rol_id ?? 2,
      activo: user?.activo ?? true
    });
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
    this.fileInput?.nativeElement && (this.fileInput.nativeElement.value = '');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.messages.add({ severity: 'warn', summary: 'Archivo no válido', detail: 'Selecciona una imagen JPG o PNG.' });
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.messages.add({ severity: 'warn', summary: 'Imagen muy grande', detail: 'El tamaño máximo recomendado es 2 MB.' });
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({ foto_url: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  clearFoto(): void {
    this.form.patchValue({ foto_url: '' });
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  save(): void {
    const values = this.form.getRawValue();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messages.add({ severity: 'warn', summary: 'Revisa el formulario', detail: 'Completa los campos obligatorios.' });
      return;
    }
    if (!this.editing && values.password.length < 8) {
      this.messages.add({ severity: 'warn', summary: 'Contraseña requerida', detail: 'La contraseña debe tener al menos 8 caracteres.' });
      return;
    }

    const payload: UsuarioPayload = {
      nombre: values.nombre.trim(),
      apellido: values.apellido.trim() || null,
      telefono: values.telefono.trim(),
      email: values.email.trim() || null,
      foto_url: values.foto_url || null,
      rol_id: values.rol_id,
      estado: values.activo ? 'activo' : 'inactivo'
    };
    if (values.password.trim()) {
      payload.password = values.password;
    }

    this.saving = true;
    const request$ = this.editing
      ? this.service.update(this.editing.id, payload)
      : this.service.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.closeDialog();
        this.load();
        this.messages.add({ severity: 'success', summary: 'Usuario guardado', detail: this.editing ? 'Los cambios se aplicaron correctamente.' : 'El usuario fue registrado.' });
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.messages.add({
          severity: 'error',
          summary: 'No se pudo guardar',
          detail: error.error?.error?.message || error.error?.message || 'Ocurrió un error al guardar.'
        });
      }
    });
  }

  remove(user: Usuario): void {
    this.confirmation.confirm({
      header: 'Eliminar usuario',
      message: `¿Eliminar a ${user.nombre} ${user.apellido ?? ''}? Esta acción no se puede deshacer.`,
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.service.delete(user.id).subscribe({
          next: () => {
            this.load();
            this.messages.add({ severity: 'success', summary: 'Usuario eliminado' });
          },
          error: (error: HttpErrorResponse) => {
            this.messages.add({
              severity: 'error',
              summary: 'No se pudo eliminar',
              detail: error.error?.error?.message || 'Ocurrió un error.'
            });
          }
        });
      }
    });
  }

  hasError(controlName: 'nombre' | 'telefono' | 'password'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
