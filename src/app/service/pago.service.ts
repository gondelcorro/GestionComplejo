import { Pago } from './../model/pago';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private access_token = sessionStorage.getItem(environment.token);
  pagoCanmbio = new Subject<Pago[]>(); //Variable de tipo Subject para prog reactiva, va a permitir detectar un cambio y actualizar la pantalla

  constructor(private http: HttpClient) { }

  registrar(cancha : Pago){
    return this.http.post<number>(environment.url_gestionComplejos + `/cancha/registrar`, cancha, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });
  }

  editar(cancha : Pago){
    return this.http.put<number>(environment.url_gestionComplejos + `/cancha/modificar`, cancha, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });
  }

  listarPorComplejo(idComplejo: number){
    return this.http.get<Pago[]>(environment.url_gestionComplejos + `/cancha/listar/${idComplejo}`,  {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });
  }

}
