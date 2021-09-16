import {Complejo} from './complejo';
import {Cancha} from './cancha';
import {Jugador} from './jugador';

export class TurnoFijo{
  idTurnoFijo: number;
  complejo: Complejo;
  cancha: Cancha;
  jugador: Jugador;
  fechaAlta: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: number;
  cantDiasAsignados: number;
  activo: boolean;
}
