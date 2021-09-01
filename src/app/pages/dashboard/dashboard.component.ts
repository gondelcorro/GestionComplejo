import {Component, OnInit} from '@angular/core';
import {ReservaService} from '../../service/reserva.service';
import {ComplejoSharedService} from '../../service/complejo-shared.service';
import {EstadoReserva} from '../../model/estadoReserva';
import {DatePipe} from '@angular/common';
import {ComplejoService} from '../../service/complejo.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  images = [
    {path: 'assets/images/carousel/autogestion.jpg'},
    {path: 'assets/images/carousel/automoviles.jpg'},
    {path: 'assets/images/carousel/bicicleta.jpg'}
  ];
  public cantReservasConf = 0;
  public cantReservasFin = 0;
  public cantReservasAnu = 0;

  constructor(private reservaService: ReservaService, private complejoSharedService: ComplejoSharedService,
              private datePipe: DatePipe, private complejoService: ComplejoService) {
  }

  ngOnInit(): void {
    this.cargarData();
  }

  private async cargarData(){
    let complejo = await this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).toPromise();
    const fecha = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.reservaService.listarPorComplejoYFecha(complejo, fecha).subscribe(reservas => {
      this.complejoSharedService.setComplejo(complejo);
      this.cantReservasConf = reservas.filter(reserva => reserva.estado == EstadoReserva.CONFIRMADA).length;
      this.cantReservasFin = reservas.filter(reserva => reserva.estado == EstadoReserva.FINALIZADA).length;
      this.cantReservasAnu = reservas.filter(reserva => reserva.estado == EstadoReserva.ANULADA).length;
    });
  }

}
