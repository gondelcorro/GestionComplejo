import { Complejo } from './../model/complejo';
import { Cancha } from './../model/cancha';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanchaService {

  private access_token = sessionStorage.getItem(environment.token);
  canchaCanmbio = new Subject<Cancha[]>(); //Variable de tipo Subject para prog reactiva, va a permitir detectar un cambio y actualizar la pantalla

  constructor(private http : HttpClient, private router: Router) { }

  registrar(cancha : Cancha){
    return this.http.post<number>(environment.url_gestionComplejos + `/cancha/registrar`, cancha, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });
  }

  editar(cancha : Cancha){
    return this.http.put<number>(environment.url_gestionComplejos + `/cancha/modificar`, cancha, {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });
  }

  listarPorComplejo(idComplejo: number){
    return this.http.get<Cancha[]>(environment.url_gestionComplejos + `/cancha/listar/${idComplejo}`,  {
      headers: new HttpHeaders().set('Authorization', `bearer ` + this.access_token).set('Content-Type', 'application/json')
    });
  }

   /*

  elimimnar(idPrestamo : number){
    return this.http.delete<number>(`${this.url}/elimiar/${idPrestamo}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${this.access_token}`).set('Content-Type', 'application/json')
    });
  }

  obtener(idPrestamo : number){
    return this.http.get<Prestamo>(`${this.url}/obtener/${idPrestamo}`, {
      headers: new HttpHeaders().set('Authorization', `bearer ${this.access_token}`).set('Content-Type', 'application/json')
    });
  }

 */

}
