import { Cancha } from "./cancha";

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
}
