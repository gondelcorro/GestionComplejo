import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Balance} from '../model/Balance';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {Pago} from '../model/pago';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  balanceCambio = new Subject<Pago[]>();

  constructor(private http: HttpClient) { }

  obtenerBalanceDiario(idComplejo: number, fecha: string){
    return this.http.get<Balance[]>(environment.url_gestionComplejos + `/balance/diario/${idComplejo}`, {
      params: new HttpParams().set('fecha', fecha)
    });
  }

  obtenerBalanceSemanal(idComplejo: number, fechaIni: string, fechaFin: string){
    return this.http.get<Balance[]>(environment.url_gestionComplejos + `/balance/semanal/${idComplejo}`, {
      params: new HttpParams().set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
    });
  }

  obtenerBalanceMensual(idComplejo: number, fecha: string){
    return this.http.get<Balance[]>(environment.url_gestionComplejos + `/balance/mensual/${idComplejo}`, {
      params: new HttpParams().set('fecha', fecha)
    });
  }
}
