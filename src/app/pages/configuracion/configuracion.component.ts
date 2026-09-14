import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {Complejo} from '../../model/complejo';
import {ComplejoSharedService} from '../../service/complejo-shared.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {DiasAtencionComponent} from './dias-atencion/dias-atencion.component';
import {ImagenComponent} from './imagen/imagen.component';
import {MatDialog} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {ComplejoService} from '../../service/complejo.service';
import {DiasAtencion} from '../../model/diasAtencion';
import {environment} from '../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {ConfirmaCambiosComponent} from './confirma-cambios/confirma-cambios.component';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  complejo: Complejo;
  formDatosComplejo: UntypedFormGroup;
  formDiasYHorarios: UntypedFormGroup;
  formToken: UntypedFormGroup;
  checkTodos = false;
  checkLunVier = false;
  checkPersonalizado = false;
  chipText1 = 'Estos horarios personalizaran tu atención en la agenda de reservas';
  chipText2 = 'El horario que declares se usará para definir el precio de reserva día/noche';
  chipText3 = 'Si activas esta opción los jugadores no podrán reservar canchas por el periodo de tiempo indicado';
  imgSelected: File;
  logoSelected: File;
  cierreTempHasta = new UntypedFormControl(new Date());
  minDate = new Date().setDate(new Date().getDate() + 1);

  constructor(private complejoSharedService: ComplejoSharedService, private bottomSheet: MatBottomSheet,
              private dialog: MatDialog, private datePipe: DatePipe, private complejoService: ComplejoService,
              private snackbar: MatSnackBar) {

    this.formDatosComplejo = new UntypedFormGroup({
      'nombre': new UntypedFormControl(''),
      'direccion': new UntypedFormControl(''),
      'telefono': new UntypedFormControl(''),
      'correo': new UntypedFormControl('', Validators.email),
      'imagen': new UntypedFormControl(null, Validators.required),
      'logo': new UntypedFormControl(null, Validators.required)
    });
    this.formDiasYHorarios = new UntypedFormGroup({
      'apertura': new UntypedFormControl(''),
      'cierre': new UntypedFormControl(''),
      'inicio': new UntypedFormControl(''),
      'fin': new UntypedFormControl('')
    });
    this.formToken = new UntypedFormGroup({
      'hsMinEduAnu': new UntypedFormControl(''),
      'hsMaxReserva': new UntypedFormControl(''),
      'token': new UntypedFormControl('')
    });
  }

  ngOnInit(): void {
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo => {
      this.complejo = complejo;
      this.complejoSharedService.setComplejo(this.complejo);
      this.validarDiasAtencion();
      this.complejoService.complejoCambio.subscribe(complejo => {
        this.complejo = complejo;
      });
    });
    //this.checkCierreTemporal = this.complejo.cierreTemporal;
    this.formDatosComplejo.get('imagen').valueChanges.subscribe((imagen: any) => {
      this.imgSelected = imagen;
    });
    this.formDatosComplejo.get('logo').valueChanges.subscribe((logo: any) => {
      this.logoSelected = logo;
    });
  }

  private validarDiasAtencion() {
    if (this.complejo.diasAtencion.lunes && this.complejo.diasAtencion.martes && this.complejo.diasAtencion.miercoles &&
      this.complejo.diasAtencion.jueves && this.complejo.diasAtencion.viernes && this.complejo.diasAtencion.sabado &&
      this.complejo.diasAtencion.domingo) {
      this.checkTodos = true;
    } else if (this.complejo.diasAtencion.lunes && this.complejo.diasAtencion.martes && this.complejo.diasAtencion.miercoles &&
      this.complejo.diasAtencion.jueves && this.complejo.diasAtencion.viernes && !this.complejo.diasAtencion.sabado &&
      !this.complejo.diasAtencion.domingo) {
      this.checkLunVier = true;
    } else {
      this.checkPersonalizado = true;
    }
  }

  changeTodosDias() {
    this.checkLunVier = false;
    this.checkPersonalizado = false;
    let diasAtencion = new DiasAtencion();
    diasAtencion.lunes = true;
    diasAtencion.martes = true;
    diasAtencion.miercoles = true;
    diasAtencion.jueves = true;
    diasAtencion.viernes = true;
    diasAtencion.sabado = true;
    diasAtencion.domingo = true;
    this.complejo.diasAtencion = diasAtencion;
    console.log(this.complejo.diasAtencion);
  }

  changeLunVier() {
    this.checkTodos = false;
    this.checkPersonalizado = false;
    let diasAtencion = new DiasAtencion();
    diasAtencion.lunes = true;
    diasAtencion.martes = true;
    diasAtencion.miercoles = true;
    diasAtencion.jueves = true;
    diasAtencion.viernes = true;
    diasAtencion.sabado = false;
    diasAtencion.domingo = false;
    this.complejo.diasAtencion = diasAtencion;
  }

  abrirDiasAtencion() {
    this.checkTodos = false;
    this.checkLunVier = false;
    if (this.checkPersonalizado) {
      const bottomSheetRef = this.bottomSheet.open(DiasAtencionComponent, {
        data: {
          complejoSelect: this.complejo
        }
      });
      bottomSheetRef.afterDismissed().subscribe(result => {
        this.complejo.diasAtencion = result;
        if (!this.complejo.diasAtencion.lunes && !this.complejo.diasAtencion.martes && !this.complejo.diasAtencion.miercoles
          && !this.complejo.diasAtencion.jueves && !this.complejo.diasAtencion.viernes && !this.complejo.diasAtencion.sabado
          && !this.complejo.diasAtencion.domingo) {
          this.checkPersonalizado == false;
        }
        //console.log(result);
      });
    }
  }

  verImagen(complejoSelect: Complejo, imgOrlogo: number) {
    this.dialog.open(ImagenComponent, {
      data: {
        complejoSelect,
        imgOrlogo
      }
    });
  }

  //PARAMS CON MISMO NOMBRE Q EN EL HTML Y SIN DECLARAR TIPO
  guardarCambios() {
    if (this.validarCampos()) {
      if (this.formDatosComplejo.valid && this.formDiasYHorarios.valid && this.formToken.valid) {
        console.log(this.complejo);
        let horaCierre = Number(this.formDiasYHorarios.controls['cierre'].value.substring(0, 2));
        let horaFin = Number(this.formDiasYHorarios.controls['fin'].value.substring(0, 2));
        this.dialog.open(ConfirmaCambiosComponent, {
          width:'380px',
          height: '280px',
          data:{
            horaCierre: horaCierre,
            horaFin: horaFin,
            complejo: this.complejo,
            imagen: this.imgSelected,
            logo: this.logoSelected
          }
        })
      }
    }
  }

  validarCampos(): boolean {
    let validado = false;
    if (this.imgSelected == null || this.logoSelected == null) {
      this.snackbar.open('Los campos Imagen y Logo son obligatorios', 'Aviso', {
        duration: 5000
      });
      return validado;
    }
    if (this.complejo.diasAtencion == undefined) {
      this.snackbar.open('Debe seleccionar al menos un día de atención a la semana', 'Aviso', {
        duration: 5000
      });
      return validado;
    }
    let horaIni = Number(this.formDiasYHorarios.controls['inicio'].value.substring(0, 2));
    let horaFin = Number(this.formDiasYHorarios.controls['fin'].value.substring(0, 2));
    let horaInicioAsDate = new Date();
    let horaFinAsDate = new Date();
    horaInicioAsDate.setHours(horaIni);
    horaFinAsDate.setHours(horaFin);
    if (horaFinAsDate.getTime() <= horaInicioAsDate.getTime()) {
      this.snackbar.open('La hora de fin de su horario diurno debe' +
        ' ser posterior a la hora de inicio', 'Aviso', {
        duration: 5000
      });
      return validado;
    }
    if(this.complejo.cierreTemporal && this.cierreTempHasta.value == null){
      this.snackbar.open('Seleccioná una fecha hasta la cual permanecerá cerado el complejo', 'Aviso', {
        duration: 5000
      });
      return validado;
    }
    validado = true;
    return validado;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.complejo.cierreTempHasta = this.datePipe.transform(event.value, 'dd-MM-yyyy');
  }
}
