import {Component, Input, OnInit} from '@angular/core';
import {TurnoFijo} from '../../../model/TurnoFijo';
import {EstadoReserva} from '../../../model/estadoReserva';
import {Reserva} from '../../../model/reserva';
import {TurnoFijoService} from '../../../service/turno-fijo.service';

@Component({
  selector: 'reservas-turno',
  templateUrl: './reservas-turno.component.html',
  styleUrls: ['./reservas-turno.component.css']
})
export class ReservasTurnoComponent implements OnInit {

  @Input() turnoFijo: TurnoFijo;
  public reservasConfirmadas: Reserva[];
  public reservasFinalizadas: Reserva[];

  constructor(private turnoFijoService: TurnoFijoService) {
  }

  ngOnInit(): void {
    this.reservasConfirmadas = this.turnoFijo.reservas.filter(reserva => reserva.estado == EstadoReserva.CONFIRMADA);
    this.reservasFinalizadas = this.turnoFijo.reservas.filter(reserva => reserva.estado == EstadoReserva.FINALIZADA);
    this.turnoFijoService.turnoFijoCambio.subscribe(turno =>{
      this.turnoFijo = turno;
      this.reservasConfirmadas = turno.reservas.filter(reserva => reserva.estado == EstadoReserva.CONFIRMADA);
      this.reservasFinalizadas = turno.reservas.filter(reserva => reserva.estado == EstadoReserva.FINALIZADA);
    });
  }

}
