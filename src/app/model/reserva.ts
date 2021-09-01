import {Complejo} from './complejo';
import {Cancha} from './cancha';
import {Jugador} from './jugador';
import {EstadoReserva} from './estadoReserva';

export class Reserva{
  idReserva: number;
  codigo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  complejo: Complejo;
  cancha: Cancha;
  jugador: Jugador;
  automatica: boolean;
  estado: EstadoReserva;
}
