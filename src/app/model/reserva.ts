import {Complejo} from './complejo';
import {Cancha} from './cancha';
import {Jugador} from './jugador';
import {EstadoReserva} from './estadoReserva';
import {TurnoFijo} from './TurnoFijo';

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
  esTurnoFijo: boolean;
  estado: EstadoReserva;
}
