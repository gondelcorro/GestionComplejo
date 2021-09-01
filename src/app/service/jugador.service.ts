import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Jugador} from '../model/jugador';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JugadorService {

  constructor(private httpClient: HttpClient) { }

  listar(){
    return this.httpClient.get<Jugador[]>(environment.url_gestionComplejos + '/jugador/listar');
  }
}
