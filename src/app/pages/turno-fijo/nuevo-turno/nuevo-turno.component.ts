import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {DatePipe} from '@angular/common';
import {EstadoReserva} from '../../../model/estadoReserva';
import {ReservaService} from '../../../service/reserva.service';
import {JugadorService} from '../../../service/jugador.service';
import {Jugador} from '../../../model/jugador';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {ComplejoService} from '../../../service/complejo.service';
import {Complejo} from '../../../model/complejo';
import {CanchaService} from '../../../service/cancha.service';
import {Cancha} from '../../../model/cancha';
import {TurnoFijo} from '../../../model/TurnoFijo';
import {TurnoFijoService} from '../../../service/turno-fijo.service';

@Component({
  selector: 'app-nuevo-turno',
  templateUrl: './nuevo-turno.component.html',
  styleUrls: ['./nuevo-turno.component.css']
})
export class NuevoTurnoComponent implements OnInit {

  public complejo: Complejo;
  public canchas: Cancha[] = [];
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  form: UntypedFormGroup;
  format = 24;
  minutesGap = 30;
  horaPorDefecto: string = "19:00";
  listaJugadores: Jugador[];
  jugadoresFiltrados: Observable<Jugador[]>;
  fechaAlta: Date;
  maxDate: Date;

  constructor(public dialogRefNueva: MatDialogRef<NuevoTurnoComponent>, private datePipe: DatePipe,
              private turnoFijoService: TurnoFijoService, private snackBar: MatSnackBar, private canchaService: CanchaService,
              private jugadorService: JugadorService, private complejoService: ComplejoService) {

    this.form = new UntypedFormGroup({
      'fechaAlta': new UntypedFormControl(this.fechaAlta, Validators.required),
      'horaInicio': new UntypedFormControl('', Validators.required),
      'horaFin': new UntypedFormControl('', Validators.required),
      'jugador': new UntypedFormControl('', Validators.required),
      'cancha': new UntypedFormControl('', Validators.required),
      'diaSelect': new UntypedFormControl('', Validators.required),
      'cantTurnos': new UntypedFormControl(1, Validators.required)
    });

    this.fechaAlta = new Date();
    this.maxDate = new Date(); this.maxDate.setMonth(this.fechaAlta.getMonth() + 1);
  }

  ngOnInit(): void {
    this.listarJugadores();
    this.jugadoresFiltrados = this.form.controls.jugador.valueChanges.pipe(
      startWith(''),
      map(correo => this._filterJugador(correo))
    );
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo => {
      this.complejo = complejo;
      this.listarCanchas();
    });
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
    this.form.patchValue({jugador: jugadorSelect});
    console.log(jugadorSelect);
  }

  listarCanchas() {
    this.canchaService.listarPorComplejo(this.complejo.idComplejo).subscribe(canchas => {
      canchas.forEach(cancha => {
        if (cancha.habilitada) {
          this.canchas.push(cancha);
        } else {
          let dia = Number(cancha.fechaDeshabilitada.substring(0, 2));
          let mes = Number(cancha.fechaDeshabilitada.substring(3, 5));
          let anio = Number(cancha.fechaDeshabilitada.substring(6, 10));
          let fechaDeshabilitacion: Date = new Date(anio, mes - 1, dia);
          const fechaActual = new Date();
          if (fechaActual.getTime() < fechaDeshabilitacion.getTime()) {
            this.canchas.push(cancha);
          }
        }
      });
    });
  }

  reservarCancha() {
    let horaFin = Number(this.form.controls['horaFin'].value.substring(0, 2));
    let minFin = Number(this.form.controls['horaFin'].value.substring(3, 5));
    let horaInicioAsDate = new Date(this.form.get('horaInicio').value);
    let horaFinAsDate = new Date(this.form.get('horaFin').value);
    if (horaFin == 0 && minFin == 30) {
      this.snackBar.open('La hora de inicio y fin de reserva debe estar dentro del mismo día', 'Error', {
        duration: 5000
      });
    } else {
      if (horaFin == 0) {
        horaFin = 23;
        minFin = 59;
      }
      if (horaFinAsDate.getTime() <= horaInicioAsDate.getTime()) {
        this.snackBar.open('La hora de fin debe ser posterior a la hora de inicio', 'Error', {
          duration: 5000
        });
      } else {
        //NUEVA RESERVA
        let turnoFijo = new TurnoFijo();
        turnoFijo.horaInicio = this.form.get('horaInicio').value
        turnoFijo.horaFin = this.form.get('horaFin').value
        turnoFijo.complejo = this.complejo;
        turnoFijo.cancha = this.form.get('cancha').value;
        turnoFijo.jugador = this.form.get('jugador').value;
        turnoFijo.diaSemana = this.diaSelectANumber(this.form.get('diaSelect').value);
        turnoFijo.cantDiasAsignados = this.form.get('cantTurnos').value;
        turnoFijo.activo = true;
        turnoFijo.fechaAlta = this.datePipe.transform(this.form.controls.fechaAlta.value, 'dd-MM-yyyy');
        this.turnoFijoService.verificarDisponibilidadTF(turnoFijo).subscribe(disponible =>{
          if(disponible){
            this.turnoFijoService.registrar(turnoFijo).subscribe(resp => {
              if (resp.codigo == 99) {
                this.dialogRefNueva.close();
                this.snackBar.open('Turno fijo registrado correctamente', 'Error', {
                  duration: 5000
                });
                this.turnoFijoService.listarPorComplejo(this.complejo.idComplejo).subscribe(turnos =>{
                  this.turnoFijoService.turnoFijoListCambio.next(turnos);
                });
              } else {
                this.snackBar.open(resp.descripcion, 'Error', {
                  duration: 5000
                });
              }
            });
          }else{
            this.snackBar.open('El turno fijo seleccionado no está disponible', 'Error', {
              duration: 5000
            });
          }
        });
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

  diaSelectANumber(diaSemana: string){
    switch (diaSemana){
      case 'Lunes' : return 1; break;
      case 'Martes' : return 2; break;
      case 'Miércoles' : return 3; break;
      case 'Jueves' : return 4; break;
      case 'Viernes' : return 5; break;
      case 'Sábado' : return 6; break;
      case 'Domingo' : return 0; break;
    }
  }

}
