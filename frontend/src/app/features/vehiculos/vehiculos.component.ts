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
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

import { Vehiculo, VehiculoPayload } from './vehiculo.models';
import { VehiculosService } from './vehiculos.service';
import { UsuariosService, Usuario } from '../usuarios/usuarios.service';

@Component({
  selector: 'app-vehiculos',
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
    ReactiveFormsModule,
    TableModule,
    TagModule
  ],
  providers: [ConfirmationService],
  templateUrl: './vehiculos.component.html',
  styleUrl: './vehiculos.component.scss'
})
export class VehiculosComponent implements OnInit {
  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  private readonly fb = inject(FormBuilder);
  private readonly vehiculosService = inject(VehiculosService);
  private readonly usuariosService = inject(UsuariosService);
  private readonly messages = inject(MessageService);
  private readonly confirmation = inject(ConfirmationService);

  readonly pageSizeOptions = [5, 10, 20, 50];

  vehiculos: Vehiculo[] = [];
  usuarios: Usuario[] = [];
  loading = false;
  saving = false;
  dialogVisible = false;
  editing: Vehiculo | null = null;
  page = 1;
  pageSize = 10;
  total = 0;
  searchUnit = '';
  filterType = '';
  filterStatus = '';

  readonly form = this.fb.nonNullable.group({
    unidad_nro: ['', [Validators.required, Validators.minLength(2)]],
    tipo: ['', [Validators.required, Validators.minLength(2)]],
    placa_serie: [''],
    marca: [''],
    modelo: [''],
    foto_url: [''],
    uso_total_horas: ['0 hours'],
    activo: [true],
    conductor_id: [null as number | null]
  });

  ngOnInit(): void {
    this.load();
    this.loadUsuarios();
  }

  get activeCount(): number {
    return this.vehiculos.filter((v) => v.activo).length;
  }

  loadUsuarios(): void {
    this.usuariosService.list(1, 100).subscribe({
      next: (response) => {
        this.usuarios = response.data;
      },
      error: () => {
        this.messages.add({ severity: 'warn', summary: 'Trabajadores', detail: 'No se pudieron cargar los conductores.' });
      }
    });
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

  load(): void {
    this.loading = true;
    const activo = this.filterStatus === '' ? undefined : this.filterStatus === 'true';

    this.vehiculosService.list({
      page: this.page,
      limit: this.pageSize,
      unidad_nro: this.searchUnit.trim() || undefined,
      tipo: this.filterType.trim().toLowerCase() || undefined,
      activo
    }).subscribe({
      next: (response) => {
        this.vehiculos = response.data;
        this.total = response.pagination.total;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.showError(error, 'No se pudo cargar la flota');
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  clearFilters(): void {
    this.searchUnit = '';
    this.filterType = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  paginate(event: PaginatorState): void {
    this.page = (event.page ?? 0) + 1;
    this.pageSize = event.rows ?? 10;
    this.load();
  }

  openCreate(): void {
    this.editing = null;
    this.form.reset({
      unidad_nro: '',
      tipo: '',
      placa_serie: '',
      marca: '',
      modelo: '',
      foto_url: '',
      uso_total_horas: '0 hours',
      activo: true,
      conductor_id: null
    });
    this.dialogVisible = true;
  }

  openEdit(vehiculo: Vehiculo): void {
    this.editing = vehiculo;
    this.form.reset({
      unidad_nro: vehiculo.unidad_nro,
      tipo: vehiculo.tipo,
      placa_serie: vehiculo.placa_serie ?? '',
      marca: vehiculo.marca ?? '',
      modelo: vehiculo.modelo ?? '',
      foto_url: vehiculo.foto_url ?? '',
      uso_total_horas: vehiculo.uso_total_horas ?? '0 hours',
      activo: vehiculo.activo ?? true,
      conductor_id: vehiculo.conductor_id ?? null
    });
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.value = '';
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messages.add({ severity: 'warn', summary: 'Revisa el formulario', detail: 'Completa los campos obligatorios.' });
      return;
    }

    const raw = this.form.getRawValue();
    const payload: VehiculoPayload = {
      unidad_nro: raw.unidad_nro.trim(),
      tipo: raw.tipo.trim(),
      placa_serie: this.optionalValue(raw.placa_serie),
      marca: this.optionalValue(raw.marca),
      modelo: this.optionalValue(raw.modelo),
      foto_url: this.optionalValue(raw.foto_url),
      activo: raw.activo,
      conductor_id: raw.conductor_id
    };

    if (this.editing) {
      payload.uso_total_horas = raw.uso_total_horas.trim() || '0 hours';
    }

    this.saving = true;
    const request = this.editing
      ? this.vehiculosService.update(this.editing.id, payload)
      : this.vehiculosService.create(payload);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.closeDialog();
        this.messages.add({
          severity: 'success',
          summary: this.editing ? 'Vehículo actualizado' : 'Vehículo registrado',
          detail: `${payload.unidad_nro} fue guardado correctamente`
        });
        this.load();
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.showError(error, 'No se pudo guardar el vehículo');
      }
    });
  }

  confirmDelete(vehiculo: Vehiculo): void {
    this.confirmation.confirm({
      header: 'Eliminar vehículo',
      message: `¿Eliminar la unidad ${vehiculo.unidad_nro}? Esta acción no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.delete(vehiculo)
    });
  }

  conductorName(vehiculo: Vehiculo): string {
    if (vehiculo.conductor) {
      return `${vehiculo.conductor.nombre} ${vehiculo.conductor.apellido ?? ''}`.trim();
    }
    return 'Sin asignar';
  }

  hasError(controlName: 'unidad_nro' | 'tipo'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  private delete(vehiculo: Vehiculo): void {
    this.vehiculosService.delete(vehiculo.id).subscribe({
      next: () => {
        this.messages.add({
          severity: 'success',
          summary: 'Vehículo eliminado',
          detail: `La unidad ${vehiculo.unidad_nro} fue eliminada`
        });
        if (this.vehiculos.length === 1 && this.page > 1) this.page--;
        this.load();
      },
      error: (error: HttpErrorResponse) => this.showError(error, 'No se pudo eliminar el vehículo')
    });
  }

  private optionalValue(value: string): string | null {
    return value.trim() || null;
  }

  private showError(error: HttpErrorResponse, fallback: string): void {
    const detail = error.error?.error?.message || error.error?.message || fallback;
    this.messages.add({ severity: 'error', summary: fallback, detail });
  }
}
