import {Cancha} from './cancha';
import {DiasAtencion} from './diasAtencion';

export class Complejo {
  idComplejo: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  apertura: string;
  cierre: string;
  imagen: any;
  logo: any;
  canchas: Cancha[];
  diurnoIni: string;
  diurnoFin: string;
  diasAtencion: DiasAtencion;
  accessToken: string;
  cierreTemporal: boolean;
  cierreTempHasta: string;
  hsMinEdiAnu: number;
  hsMaxReserva: number;
}
