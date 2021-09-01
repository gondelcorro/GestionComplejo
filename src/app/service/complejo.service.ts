import { Complejo } from './../model/complejo';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplejoService {

  public complejoCambio = new Subject<Complejo>();

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

  modificarComplejo(complejo: Complejo){
    return this.http.put<Complejo>(environment.url_gestionComplejos + "/complejo/modificar", complejo);
  }

  guardarArchivo(formData: FormData, idComplejo: number) {
    return this.http.post(environment.url_gestionComplejos + "/complejo/guardarArchivo/" + `${idComplejo}`, formData, {
      responseType: 'text'//el backend devuelve un texto
    });
  }

  autenticarUsuario(usuario: string, claveActual: string){
    let body= {
      'usuario': usuario,
      'clave': claveActual
    }
    return this.http.post<boolean>(environment.url_gestionComplejos + `/complejo/autenticacion`, body);
  }

  cambiarClave(usuario: string, nuevaClave: string){
    let body= {
      'usuario': usuario,
      'clave': nuevaClave
    }
    return this.http.put<boolean>(environment.url_gestionComplejos + `/complejo/cambioClave`, body);
  }

}
