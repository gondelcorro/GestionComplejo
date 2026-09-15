import {ComplejoSharedService} from './../../service/complejo-shared.service';
import {Component, OnInit} from '@angular/core';
import {CanchaService} from 'src/app/service/cancha.service';
import {Cancha} from 'src/app/model/cancha';
import {ReservaService} from '../../service/reserva.service';
import {Complejo} from '../../model/complejo';
import {Reserva} from '../../model/reserva';
import {DatePipe} from '@angular/common';
import {environment} from '../../../environments/environment';
import {ComplejoService} from '../../service/complejo.service';

@Component({
    selector: 'app-reserva',
    templateUrl: './reserva.component.html',
    styleUrls: ['./reserva.component.css'],
    standalone: false
})
export class ReservaComponent implements OnInit {

  public canchas: Cancha[] = [];
  public complejo: Complejo;
  public selectedCancha: Cancha;
  public selectedFecha: Date = new Date();
  public reservas: Reserva[];
  public reservaSelect: Reserva = null; //Va null desde aca porq es nueva reserva

  constructor(private canchaService: CanchaService, private complejoSharedService: ComplejoSharedService,
              private reservaService: ReservaService, private datePipe: DatePipe, private complejoService: ComplejoService) {

  }

  ngOnInit(): void {
    console.log(this.reservas);
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo => {
      this.complejo = complejo;
      this.complejoSharedService.setComplejo(this.complejo);
      this.listarCanchas();
    });
  }

  listarCanchas() {
    this.canchaService.listarPorComplejo(this.complejo.idComplejo).subscribe(canchas => {
      canchas.forEach( cancha => {
        if(cancha.habilitada){
          this.canchas.push(cancha);
        }
        else{
          let dia = Number(cancha.fechaDeshabilitada.substring(0,2));
          let mes = Number(cancha.fechaDeshabilitada.substring(3,5));
          let anio = Number(cancha.fechaDeshabilitada.substring(6,10));
          let fechaDeshabilitacion: Date = new Date(anio, mes-1, dia)
          const fechaActual = new Date();
          if(fechaActual.getTime() < fechaDeshabilitacion.getTime()){
            this.canchas.push(cancha);
          }
        }
      });
    });
  }

  public cargarReservas() {
    const fechaIniFormateada = this.datePipe.transform(this.selectedFecha, 'dd-MM-yyyy');
    let fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() + 6);
    const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
    console.log(fechaFinFormateada);
    this.reservaService.verDisponibilidadxSemana(this.complejo.idComplejo, this.selectedCancha.idCancha, fechaIniFormateada,
      fechaFinFormateada).subscribe(reservas => {
      this.reservas = reservas;
      this.reservaService.reservasCambio.next(reservas);
      console.log(reservas);
    });
  }

}
