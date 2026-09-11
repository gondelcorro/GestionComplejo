import {Component, Input, OnInit} from '@angular/core';
import {TurnoFijo} from '../../../model/TurnoFijo';
import {EstadoReserva} from '../../../model/estadoReserva';
import {Reserva} from '../../../model/reserva';
import {TurnoFijoService} from '../../../service/turno-fijo.service';
import {ReservaPago} from '../../../model/ReservaPago';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {AbonarFechaComponent} from './abonar-fecha/abonar-fecha.component';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {ReservaService} from '../../../service/reserva.service';
import {CancelarFechaComponent} from './cancelar-fecha/cancelar-fecha.component';

@Component({
  selector: 'reservas-turno',
  templateUrl: './reservas-turno.component.html',
  styleUrls: ['./reservas-turno.component.css']
})
export class ReservasTurnoComponent implements OnInit {

  @Input() turnoFijo: TurnoFijo;
  public reservasConfirmadas: ReservaPago[];
  public reservasAnuladas: ReservaPago[];
  public reservasFinalizadas: ReservaPago[];

  constructor(private turnoFijoService: TurnoFijoService, private dialog: MatDialog, private snackBar: MatSnackBar,
              private reservaService: ReservaService) {
  }

  ngOnInit(): void {
    this.obtenerEstadoPagoReservaTF(this.turnoFijo);
    this.turnoFijoService.turnoFijoCambio.subscribe(turno =>{
      this.turnoFijo = turno;
      this.obtenerEstadoPagoReservaTF(this.turnoFijo);
    });
  }

  private obtenerEstadoPagoReservaTF(turnoFijo: TurnoFijo){
    this.turnoFijoService.obtenerEstadoPagoReservaTF(turnoFijo.idTurnoFijo).subscribe(data =>{
      this.reservasConfirmadas = data.filter(data => data.reserva.estado == EstadoReserva.CONFIRMADA).reverse();
      this.reservasAnuladas = data.filter(data => data.reserva.estado == EstadoReserva.ANULADA).reverse();
      this.reservasFinalizadas = data.filter(data => data.reserva.estado == EstadoReserva.FINALIZADA).reverse();
    });
  }

  public abonarFecha(fecha: Reserva){
    this.dialog.open(AbonarFechaComponent, {
      width: '350px',
      disableClose: false,
      data: fecha
    });
  }

  public cancelarFecha(reserva: Reserva) {
    if (reserva.estado == EstadoReserva.CONFIRMADA) {
      this.reservaService.validarReglasAnulacion(reserva).subscribe(resp => {
        if (resp.codigo == 99) {
          this.dialog.open(CancelarFechaComponent, {
            data: {
              reserva: reserva,
              idTurnoFijo: this.turnoFijo.idTurnoFijo
            },
            disableClose: true,
            width: '500px'
          });
        } else {
          this.snackBar.open(resp.descripcion, 'Aviso', {duration: 5000});
        }
      });
    }else if(reserva.estado == EstadoReserva.ANULADA){
      this.snackBar.open('La reserva ya fué anulada', 'Aviso', {duration: 5000});
    }
  }
}
