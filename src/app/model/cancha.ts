import { TipoCancha } from './tipoCancha';
import { Complejo } from './complejo';

export class Cancha{
    idCancha: number;
    complejo: Complejo;
    numero: number;
    tipo: TipoCancha;
    precioDia: number;
    precioNoche: number;
    habilitada: boolean;
    fechaDeshabilitada: string;
}
