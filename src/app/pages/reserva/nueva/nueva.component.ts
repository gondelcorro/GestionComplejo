import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {DatePipe} from '@angular/common';
import {EstadoReserva} from '../../../model/estadoReserva';
import {Reserva} from '../../../model/reserva';
import {ReservaService} from '../../../service/reserva.service';
import {JugadorService} from '../../../service/jugador.service';
import {Jugador} from '../../../model/jugador';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ProcesandoReservaComponent} from '../procesando-reserva/procesando-reserva.component';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-nueva',
  templateUrl: './nueva.component.html',
  styleUrls: ['./nueva.component.css']
})
export class NuevaComponent implements OnInit {

  form: UntypedFormGroup;
  format = 24;
  minutesGap = 30;
  fechaFormateada: string;
  horaInicio: string;
  horaMin: string;
  selectedTime;
  listaJugadores: Jugador[];
  jugadorSelect: Jugador;
  jugadoresFiltrados: Observable<Jugador[]>;
  mostrarImporte = false;
  importeAPagar = 0;
  ocultarSelectJugador = false;

  constructor(public dialogRefNueva: MatDialogRef<NuevaComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private datePipe: DatePipe, private reservaService: ReservaService, private snackBar: MatSnackBar,
              private jugadorService: JugadorService, private dialog: MatDialog) {

    this.form = new UntypedFormGroup({
      'horaFin': new UntypedFormControl(''),
      'jugador': new UntypedFormControl('')
    });
    this.fechaFormateada = this.datePipe.transform(data.fechaReserva, 'dd-MM-yyyy');
    this.horaInicio = this.datePipe.transform(data.fechaReserva, 'HH:mm');
    this.ocultarSelectJugador = this.data.reservaEdicion != null;
  }

  ngOnInit(): void {
    this.listarJugadores();
    this.jugadoresFiltrados = this.form.controls.jugador.valueChanges.pipe(
      startWith(''),
      map(correo => this._filterJugador(correo))
    );
  }

  public listarJugadores() {
    this.jugadorService.listar().subscribe(jugadores => {
      this.listaJugadores = jugadores;
    });
  }

  private _filterJugador(correo: string): Jugador[] {
    return this.listaJugadores?.filter(jugador => jugador.correo.includes(correo));
  }

  fcionMostrarJugador(jugador: Jugador): string {
    return jugador && jugador.correo ? jugador.correo : '';
  }

  updateJugadorSelect(jugadorSelect: Jugador) {
    this.jugadorSelect = jugadorSelect;
    console.log(this.jugadorSelect);
  }

  reservarCancha() {
    let horaFin = Number(this.form.controls['horaFin'].value.substring(0, 2));
    let minFin = Number(this.form.controls['horaFin'].value.substring(3, 5));
    let horaInicioAsDate = new Date(this.data.fechaReserva);
    let horaFinAsDate = new Date(this.data.fechaReserva);
    if (horaFin == 0 && minFin == 30) {
      this.snackBar.open('La hora de inicio y fin de reserva debe estar dentro del mismo día', 'Error', {
        duration: 5000
      });
    } else {
      if (horaFin == 0) {
        horaFin = 23;
        minFin = 59;
      }
      horaFinAsDate.setHours(horaFin, minFin);
      if (horaFinAsDate.getTime() <= horaInicioAsDate.getTime()) {
        this.snackBar.open('La hora de fin debe ser posterior a la hora de inicio', 'Error', {
          duration: 5000
        });
      } else {
        //NUEVA RESERVA
        if(this.data.reservaEdicion == null){
          let reserva = new Reserva();
          reserva.fecha = this.fechaFormateada;
          reserva.horaInicio = this.horaInicio;
          reserva.horaFin = this.datePipe.transform(horaFinAsDate, 'HH:mm');
          reserva.complejo = this.data.complejo;
          reserva.cancha = this.data.cancha;
          reserva.jugador = this.jugadorSelect;
          reserva.automatica = false;
          reserva.estado = EstadoReserva.CONFIRMADA;
          this.dialogRefNueva.close();
          this.reservaService.validarReglasReservaCreacion(reserva).subscribe(resp => {
            if (resp.codigo == 99) {
              this.dialog.open(ProcesandoReservaComponent, {
                width: '350px',
                disableClose: true,
                data: reserva
              });
            } else {
              this.snackBar.open(resp.descripcion, 'Error', {
                duration: 5000
              });
            }
          });
        }else{
          //EDICION DE RESERVA - SOLO LE MODIFICO LA CANCHA Y LA FECHA Y HORARIOS
          this.data.reservaEdicion.cancha = this.data.cancha;
          this.data.reservaEdicion.fecha = this.fechaFormateada;
          this.data.reservaEdicion.horaInicio = this.horaInicio;
          this.data.reservaEdicion.horaFin = this.datePipe.transform(horaFinAsDate, 'HH:mm');
          this.reservaService.validarReglasEdicion(this.data.reservaEdicion, "otrasReglas").subscribe(resp =>{
            if (resp.codigo == 99) {
              this.reservaService.modificar(this.data.reservaEdicion).subscribe(data =>{
                if(data == 1){
                  const fechaIniFormateada = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
                  let fechaFin = new Date();
                  fechaFin.setDate(fechaFin.getDate()+6);
                  const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
                  this.reservaService.verDisponibilidadxSemana(this.data.reservaEdicion.complejo.idComplejo, this.data.reservaEdicion.cancha.idCancha,
                    fechaIniFormateada, fechaFinFormateada).subscribe(reservas => {
                    this.reservaService.reservasCambio.next(reservas);
                  });
                  this.dialogRefNueva.close();
                  this.snackBar.open("Reserva modificada exitosamente", 'Aviso', {
                    duration: 5000
                  });
                }else{
                  this.snackBar.open("Error al modificar la reserva", 'Error', {
                    duration: 5000
                  });
                }
              });
            } else {
              this.dialogRefNueva.close();
              this.snackBar.open(resp.descripcion, 'Error', {
                duration: 5000
              });
            }
          });
        }
      }
    }
  }

  irAFormRegistro() {
    //PARA ABRIR EN NUEVA PESTAÑA
    var a = document.createElement('a');
    a.target = '_blank';
    a.href = environment.url_registro;
    a.click();
    //document.location.href = environment.url_registro; PARA EN MISMA PESTAÑA
  }

  calcularImporte(event: string) {
    if (this.selectedTime != null) {
      let horaFin = Number(this.form.controls['horaFin'].value.substring(0, 2));
      let minFin = Number(this.form.controls['horaFin'].value.substring(3, 5));
      let horaInicioAsDate = new Date(this.data.fechaReserva);
      let horaFinAsDate = new Date(this.data.fechaReserva);
      if (horaFin == 0) {
        horaFin = 23;
        minFin = 59;
      }
      horaFinAsDate.setHours(horaFin, minFin);
      if (horaFinAsDate.getTime() <= horaInicioAsDate.getTime()) {
        this.snackBar.open('La hora de fin debe ser posterior a la hora de inicio', 'Error', {
          duration: 5000
        });
      } else {
        let reserva = new Reserva();
        reserva.cancha = this.data.cancha;
        reserva.horaInicio = this.horaInicio;
        reserva.horaFin = this.datePipe.transform(horaFinAsDate, 'HH:mm');
        reserva.complejo = this.data.complejo;
        this.reservaService.calcularImporte(reserva).subscribe(importe => {
          this.importeAPagar = importe;
          this.mostrarImporte = true;
        });
      }
    }
  }

}
