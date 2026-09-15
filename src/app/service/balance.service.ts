import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.get<Balance[]>(environment.url_sejuegasgo + `/balance/diario/${idComplejo}`, {
      params: new HttpParams().set('fecha', fecha)
    });
  }

  obtenerBalanceSemanal(idComplejo: number, fechaIni: string, fechaFin: string){
    return this.http.get<Balance[]>(environment.url_sejuegasgo + `/balance/semanal/${idComplejo}`, {
      params: new HttpParams().set('fechaIni', fechaIni)
        .set('fechaFin', fechaFin)
    });
  }

  obtenerBalanceMensual(idComplejo: number, fecha: string){
    return this.http.get<Balance[]>(environment.url_sejuegasgo + `/balance/mensual/${idComplejo}`, {
      params: new HttpParams().set('fecha', fecha)
    });
  }

  generarPdfBalanceDiario(idComplejo: number, fecha: string){
    return this.http.get(environment.url_sejuegasgo + `/reporte/balanceDiario`, {
      params: new HttpParams().set("idComplejo", idComplejo.toString())
        .set('fecha', fecha),
      responseType: 'blob'
    });
  }

  generarPdfBalanceMensual(idComplejo: number, fecha: string){
    return this.http.get(environment.url_sejuegasgo + `/reporte/balanceMensual`, {
      params: new HttpParams().set("idComplejo", idComplejo.toString())
        .set('fecha', fecha),
      responseType: 'blob'
    });
  }
}
