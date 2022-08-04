import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Reserva} from '../model/reserva';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Subject} from 'rxjs';
import {ReglasReservaError} from '../model/reglasReservaError';
import {Complejo} from '../model/complejo';
import {Cancha} from '../model/cancha';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  reservasCambio = new Subject<Reserva[]>();
  reservasEdicionCambio = new Subject<Reserva[]>();
  canchaCambio = new Subject<Cancha>();
  fechaCambio = new Subject<Date>();

  constructor(private httpClient: HttpClient) { }

  public verDisponibilidad(idComplejo: number, idCancha: number, fecha: string) {
    return this.httpClient.get<Reserva[]>(environment.url_sejuegasgo + `/reserva/verDisponibilidad`, {
      params: new HttpParams().set('idComplejo', idComplejo.toString())
        .set('idCancha', idCancha.toString())
        .set('fecha', fecha)
    });
  }

  public verDisponibilidadxSemana(idComplejo: number, idCancha: number, fechaIni: string, fechaFin: string) {
    return this.httpClient.get<Reserva[]>(environment.url_sejuegasgo + `/reserva/verDisponibilidadSemanal`, {
      params: new HttpParams().set('idComplejo', idComplejo.toString())
        .set('idCancha', idCancha.toString())
        .set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
    });
  }

  validarReglasReservaCreacion(reserva: Reserva){
    return this.httpClient.post<ReglasReservaError>(environment.url_sejuegasgo + `/reserva/validarReglasCreacion`, reserva);
  }

  registrarReservaManual(reserva: Reserva){
    return this.httpClient.post<number>(environment.url_sejuegasgo + `/reserva/registrarReservaManual`, reserva);
  }

  obtenerPorCodigo(codigo: string){
    return this.httpClient.get<Reserva>(environment.url_sejuegasgo + `/reserva/obtenerPorCodigo/${codigo}`);
  }

  listarPorComplejoYFecha(complejo: Complejo, fecha: string){
    return this.httpClient.post<Reserva[]>(environment.url_sejuegasgo + `/reserva/listadoPorFecha/${fecha}`, complejo);
  }

  calcularImporte(reserva: Reserva){
    return this.httpClient.post<number>(environment.url_sejuegasgo + `/reserva/obtenerImporte`, reserva);
  }

  validarReglasAnulacion(reserva: Reserva){
    return this.httpClient.post<ReglasReservaError>(environment.url_sejuegasgo + `/reserva/validarReglasAnulacion`, reserva);
  }

  anular(reserva: Reserva){
    return this.httpClient.put<number>(environment.url_sejuegasgo + `/reserva/anular`, reserva);
  }

  validarReglasEdicion(reserva: Reserva, reglaAvalidar: string){
    return this.httpClient.post<ReglasReservaError>(environment.url_sejuegasgo + `/reserva/validarReglasEdicion`, reserva, {
      params: new HttpParams().set("reglaAValidar", reglaAvalidar)
    });
  }

  modificar(reserva: Reserva){
    return this.httpClient.put<number>(environment.url_sejuegasgo + `/reserva/modificar`, reserva);
  }
}

