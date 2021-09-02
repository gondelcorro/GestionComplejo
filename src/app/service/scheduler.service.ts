import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {CalendarSchedulerEvent, CalendarSchedulerEventAction, CalendarSchedulerEventStatus} from 'angular-calendar-scheduler';
import {Reserva} from '../model/reserva';
import {EstadoReserva} from '../model/estadoReserva';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {

  //public eventosDeReserva = new Subject<CalendarSchedulerEvent[]>();

  constructor() { }

  public cargarReservasEnScheduler(actions: CalendarSchedulerEventAction[], reservas: Reserva[]): Promise<CalendarSchedulerEvent[]>{

    const eventsReservas = Array.of<CalendarSchedulerEvent>();
    for (let i = 0; i < reservas?.length; i++) {
      const reserva = reservas[i];
      let dia = Number(reserva.fecha.substring(0,2));
      let mes = Number(reserva.fecha.substring(3,5));
      let anio = Number(reserva.fecha.substring(6,10));
      let horaInicio = Number(reserva.horaInicio.substring(0,2));
      let minutosInicio = Number(reserva.horaInicio.substring(3,5));
      let horaFin = Number(reserva.horaFin.substring(0,2));
      let minutosFin = Number(reserva.horaFin.substring(3,5));
      let fechaInicio : Date = new Date(anio, mes-1, dia, horaInicio, minutosInicio)
      let fechaFin : Date = new Date(anio, mes-1, dia, horaFin, minutosFin)

      let statusEvent: string;
      switch (reserva.estado){
        case EstadoReserva.CONFIRMADA: statusEvent = 'ok'; break;
        case EstadoReserva.FINALIZADA: statusEvent = 'warning'; break;
        case EstadoReserva.ANULADA: statusEvent = 'danger'; break;
      }

      eventsReservas[i] = {
        id: reserva.idReserva.toString(),
        start: fechaInicio,
        end: fechaFin,
        title: reserva.estado,
        content: reserva.codigo,
        color: { primary: '#E0E0E0', secondary: '#EEEEEE' },
        actions: actions,
        status: statusEvent as CalendarSchedulerEventStatus,
        isClickable: true,
        isDisabled: false,
        isCancelled: false
      }
    }
    /*   setTimeout(()=>{
         this.eventosDeReserva.next(eventsReservas);
       }, 0.5);*/
    return new Promise(resolve => setTimeout(() => resolve(eventsReservas), 0.0));
  }

}
