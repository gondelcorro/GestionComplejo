import { Pago } from './../model/pago';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Reserva} from '../model/reserva';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private access_token = sessionStorage.getItem(environment.token);
  pagoCanmbio = new Subject<Pago[]>(); //Variable de tipo Subject para prog reactiva, va a permitir detectar un cambio y actualizar la pantalla

  constructor(private http: HttpClient) { }

  registrar(pago : Pago){
    return this.http.post<number>(environment.url_sejuegasgo + `/pago/registrar`, pago, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });
  }

  editar(pago : Pago){
    return this.http.put<number>(environment.url_sejuegasgo + `/pago/modificar`, pago);/*, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });*/
  }

  listarPorComplejoTL(idComplejo: number){
    return this.http.get<Pago[]>(environment.url_sejuegasgo + `/pago/listarPorComplejoTL/${idComplejo}`);
  }

  listarPorComplejoTF(idComplejo: number){
    return this.http.get<Pago[]>(environment.url_sejuegasgo + `/pago/listarPorComplejoTF/${idComplejo}`);
  }

  listarPorComplejoPageable(idComplejo: number, p: number, s: number){
    return this.http.get<Pago[]>(environment.url_sejuegasgo + `/pago/listarPorComplejoPageable/${idComplejo}?page=${p}&size=${s}`/*, {
      params: new HttpParams().set('page', 'p')
        .set('size', 's')
    }*/);
  }

  detalleReserva(codigo: string){
    return this.http.get<Reserva>(environment.url_sejuegasgo + `/pago/detalleReserva/${codigo}`);/*,  {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });*/
  }

  registrarReintegro(reserva: Reserva){
    return this.http.post<number>(environment.url_sejuegasgo + `/pago/registrarReintegro`, reserva);
  }

  public obtenerPorReserva(codigoReserva: string){
    return this.http.get<Pago[]>(environment.url_sejuegasgo + `/pago/obtener/${codigoReserva}`);
  }

}
