import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Reserva} from '../model/reserva';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {ReglasReservaError} from '../model/reglasReservaError';
import {Complejo} from '../model/complejo';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  reservasCambio = new Subject<Reserva[]>();

  constructor(private httpClient: HttpClient) { }

  public verDisponibilidad(idComplejo: number, idCancha: number, fecha: string) {
    return this.httpClient.get<Reserva[]>(environment.url_gestionComplejos + `/reserva/verDisponibilidad`, {
      params: new HttpParams().set('idComplejo', idComplejo.toString())
        .set('idCancha', idCancha.toString())
        .set('fecha', fecha)
    });
  }

  public verDisponibilidadxSemana(idComplejo: number, idCancha: number, fechaIni: string, fechaFin: string) {
    return this.httpClient.get<Reserva[]>(environment.url_gestionComplejos + `/reserva/verDisponibilidadSemanal`, {
      params: new HttpParams().set('idComplejo', idComplejo.toString())
        .set('idCancha', idCancha.toString())
        .set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
    });
  }

  validarReglasReservaCreacion(reserva: Reserva){
    return this.httpClient.post<ReglasReservaError>(environment.url_gestionComplejos + `/reserva/validarReglasCreacion`, reserva);
  }

  registrarReservaManual(reserva: Reserva){
    return this.httpClient.post<number>(environment.url_gestionComplejos + `/reserva/registrarReservaManual`, reserva);
  }

  obtenerPorCodigo(codigo: string){
    return this.httpClient.get<Reserva>(environment.url_gestionComplejos + `/reserva/obtenerPorCodigo/${codigo}`);
  }

  listarPorComplejoYFecha(complejo: Complejo, fecha: string){
    return this.httpClient.post<Reserva[]>(environment.url_gestionComplejos + `/reserva/listadoPorFecha/${fecha}`, complejo);
  }

  calcularImporte(reserva: Reserva){
    return this.httpClient.post<number>(environment.url_gestionComplejos + `/reserva/obtenerImporte`, reserva);
  }

  validarReglasReservaEdiAnu(reserva: Reserva){
    return this.httpClient.post<ReglasReservaError>(environment.url_gestionComplejos + `/reserva/validarReglasEdiAnu`, reserva);
  }

  anular(reserva: Reserva){
    return this.httpClient.put<number>(environment.url_gestionComplejos + `/reserva/anular`, reserva);
  }
}

