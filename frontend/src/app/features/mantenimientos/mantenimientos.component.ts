import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Vehiculo } from '../vehiculos/vehiculo.models';
import { Mantenimiento, MantenimientoPayload, MantenimientosService } from './mantenimientos.service';

@Component({
  selector: 'app-mantenimientos', standalone: true,
  imports: [ButtonModule, CommonModule, ConfirmDialogModule, DialogModule, FormsModule, InputTextModule, PaginatorModule, ReactiveFormsModule, TableModule],
  providers: [ConfirmationService], templateUrl: './mantenimientos.component.html', styleUrl: './mantenimientos.component.scss'
})
export class MantenimientosComponent implements OnInit {
  private service=inject(MantenimientosService); private fb=inject(FormBuilder); private messages=inject(MessageService); private confirmation=inject(ConfirmationService);
  mantenimientos:Mantenimiento[]=[]; vehiculos:Vehiculo[]=[]; loading=false; saving=false; visible=false; editing:Mantenimiento|null=null; page=1; limit=10; total=0; filterVehicle='';
  form=this.fb.nonNullable.group({vehiculo_id:[0,Validators.min(1)],fecha_servicio:[new Date().toISOString().slice(0,10),Validators.required],tipo_servicio:['',Validators.required],observaciones:[''],horometro_servicio:[0,Validators.min(0)],proximo_mantenimiento_h:[0],costo_total:[0,Validators.min(.01)],foto_factura_url:['']});
  ngOnInit(){this.service.vehicles().subscribe(r=>this.vehiculos=r.data);this.load();}
  load(){this.loading=true;this.service.list(this.page,this.limit,this.filterVehicle?Number(this.filterVehicle):undefined).subscribe({next:r=>{this.mantenimientos=r.data;this.total=r.pagination.total;this.loading=false},error:()=>this.loading=false});}
  paginate(e:PaginatorState){this.page=(e.page??0)+1;this.limit=e.rows??10;this.load();}
  open(m?:Mantenimiento){this.editing=m||null;this.form.reset({vehiculo_id:m?.vehiculo_id||0,fecha_servicio:m?.fecha_servicio||new Date().toISOString().slice(0,10),tipo_servicio:m?.tipo_servicio||'',observaciones:m?.observaciones||'',horometro_servicio:Number(m?.horometro_servicio||0),proximo_mantenimiento_h:Number(m?.proximo_mantenimiento_h||0),costo_total:Number(m?.costo_total||0),foto_factura_url:m?.foto_factura_url||''});this.visible=true;}
  save(){if(this.form.invalid){this.form.markAllAsTouched();return;}const v=this.form.getRawValue();const p:MantenimientoPayload={vehiculo_id:v.vehiculo_id,fecha_servicio:v.fecha_servicio,tipo_servicio:v.tipo_servicio,observaciones:v.observaciones||null,horometro_servicio:v.horometro_servicio,proximo_mantenimiento_h:v.proximo_mantenimiento_h||null,costo_total:v.costo_total,foto_factura_url:v.foto_factura_url||null};this.saving=true;(this.editing?this.service.update(this.editing.id,p):this.service.create(p)).subscribe({next:()=>{this.saving=false;this.visible=false;this.load();this.messages.add({severity:'success',summary:'Mantenimiento guardado'})},error:(e:HttpErrorResponse)=>{this.saving=false;this.messages.add({severity:'error',summary:'No se pudo guardar',detail:e.error?.error?.message||'Error'})}});}
  remove(m:Mantenimiento){this.confirmation.confirm({header:'Eliminar mantenimiento',message:'¿Eliminar este registro?',acceptLabel:'Eliminar',rejectLabel:'Cancelar',acceptButtonStyleClass:'p-button-danger',accept:()=>this.service.delete(m.id).subscribe(()=>this.load())});}
}
