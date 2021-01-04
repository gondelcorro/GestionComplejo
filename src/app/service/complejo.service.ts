import { Complejo } from './../model/complejo';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplejoService {

  private access_token = sessionStorage.getItem(environment.token);

  constructor(private http : HttpClient, private router: Router) {

   }

   // TODOS LAS LLAMADAS AL API DE COMPLEJO VAN DESPROTEGIDAS
   obtenerComplejo(correo : string){
    return this.http.get<Complejo>( environment.url_gestionComplejos + `/complejo/obtenerPorCorreo/${correo}`);
   }

   leerArchivo(idComplejo: number, imgOrLogo:  number) {
    return this.http.get(environment.url_gestionComplejos + "/complejo/leerArchivo/" + `${idComplejo}` + "/" + `${imgOrLogo}` , {
      responseType: 'blob' //es blob xq recibe una secuencia de bytes
    });
  }

}
