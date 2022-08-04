import {Complejo} from './complejo';
import {Cancha} from './cancha';
import {Jugador} from './jugador';
import {Reserva} from './reserva';

export class TurnoFijo{
  idTurnoFijo: number;
  complejo: Complejo;
  cancha: Cancha;
  jugador: Jugador;
  fechaAlta: string;
  fechaVencimiento: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: number;
  cantDiasAsignados: number;
  cantRenovaciones: number;
  reservas: Reserva[];
  activo: boolean;
}
