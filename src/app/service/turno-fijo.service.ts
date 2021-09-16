import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TurnoFijo} from '../model/TurnoFijo';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {ReglasReservaError} from '../model/reglasReservaError';

@Injectable({
  providedIn: 'root'
})
export class TurnoFijoService {

  public turnoFijoListCambio = new Subject<TurnoFijo[]>();

  constructor(private httpClient: HttpClient) {

  }

  listarPorComplejo(idComplejo: number){
    return this.httpClient.get<TurnoFijo[]>(environment.url_gestionComplejos + `/turno-fijo/listarPorComplejo/${idComplejo}`);
  }

  registrar(turno: TurnoFijo){
    return this.httpClient.post<ReglasReservaError>(environment.url_gestionComplejos + `/turno-fijo/registrar`, turno);
  }
}
