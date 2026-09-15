import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {TurnoFijo} from '../model/TurnoFijo';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {ReglasReservaError} from '../model/reglasReservaError';
import {Reserva} from '../model/reserva';
import {ReservaPago} from '../model/ReservaPago';

@Injectable({
  providedIn: 'root'
})
export class TurnoFijoService {

  public turnoFijoListCambio = new Subject<TurnoFijo[]>();
  public turnoFijoCambio = new Subject<TurnoFijo>();

  constructor(private httpClient: HttpClient) {

  }

  obtenerTurnoFijo(idTurnoFijo: number){
    return this.httpClient.get<TurnoFijo>(environment.url_sejuegasgo + `/turno-fijo/obtener/${idTurnoFijo}`);
  }

  listarPorComplejo(idComplejo: number){
    return this.httpClient.get<TurnoFijo[]>(environment.url_sejuegasgo + `/turno-fijo/listarPorComplejo/${idComplejo}`);
  }

  verificarDisponibilidadTF(turno: TurnoFijo){
    return this.httpClient.post<boolean>(environment.url_sejuegasgo + `/turno-fijo/verificarDisponibilidadTF`, turno);
  }

  registrar(turno: TurnoFijo){
    return this.httpClient.post<ReglasReservaError>(environment.url_sejuegasgo + `/turno-fijo/registrar`, turno);
  }

  renovar(turnoFijo: TurnoFijo){
    return this.httpClient.post<ReglasReservaError>(environment.url_sejuegasgo + `/turno-fijo/renovar`, turnoFijo);
  }

  activar(turnoFijo: TurnoFijo){
    return this.httpClient.post<boolean>(environment.url_sejuegasgo + `/turno-fijo/activar`, turnoFijo);
  }

  desactivar(turnoFijo: TurnoFijo){
    return this.httpClient.post<boolean>(environment.url_sejuegasgo + `/turno-fijo/desactivar`, turnoFijo);
  }

  abonarFecha(reserva: Reserva){
    return this.httpClient.post<boolean>(environment.url_sejuegasgo + `/turno-fijo/abonarFecha`, reserva);
  }

  obtenerEstadoPagoReservaTF(idTurnoFijo: number){
    return this.httpClient.get<ReservaPago[]>(environment.url_sejuegasgo + `/turno-fijo/estadoPagoReserva/${idTurnoFijo}`);
  }

  cancelarFecha(reserva: Reserva, idTurnoFijo: number){
      return this.httpClient.put<number>(environment.url_sejuegasgo + `/turno-fijo/cancelarFecha/${idTurnoFijo}`, reserva);
  }
}
