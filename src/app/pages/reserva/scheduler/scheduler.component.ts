import {ComplejoSharedService} from './../../../service/complejo-shared.service';
import {Component, OnInit, Inject, LOCALE_ID, Input, ViewChild} from '@angular/core';
import {CalendarDateFormatter, CalendarView, CalendarViewPeriod, DateAdapter} from 'angular-calendar';
import {
  addPeriod,
  CalendarSchedulerEvent,
  CalendarSchedulerEventAction,
  CalendarSchedulerViewComponent,
  DAYS_IN_WEEK,
  endOfPeriod,
  SchedulerDateFormatter,
  SchedulerEventTimesChangedEvent, SchedulerModule, SchedulerView,
  SchedulerViewDay,
  SchedulerViewHour,
  SchedulerViewHourSegment, SchedulerViewPeriod,
  startOfPeriod,
  subPeriod
} from 'angular-calendar-scheduler';
import {addMonths, endOfDay} from 'date-fns';
import {Subject} from 'rxjs';
import {Complejo} from '../../../model/complejo';
import {Cancha} from '../../../model/cancha';
import {ReservaService} from '../../../service/reserva.service';
import {DetalleComponent} from '../detalle/detalle.component';
import {MatDialog} from '@angular/material/dialog';
import {NuevaComponent} from '../nueva/nueva.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Reserva} from '../../../model/reserva';
import {DatePipe} from '@angular/common';
import {SchedulerService} from '../../../service/scheduler.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  providers: [{
    provide: CalendarDateFormatter,
    useClass: SchedulerDateFormatter
  }]
})
export class SchedulerComponent implements OnInit {

  @Input() complejo: Complejo;
  @Input() cancha: Cancha;
  @Input() fecha: Date;
  @Input() reservas: Reserva[];
  @Input() reservaEdicion: Reserva;
  diasSemana: any[] = [];

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();
  viewDays: number = 7; //DAYS_IN_WEEK
  forceViewDays: number = 7; //DAYS_IN_WEEK

  refresh: Subject<void> = new Subject<void>();
  locale: string = 'es';
  hourSegments: number = 2;
  weekStartsOn: number = 1;
  startsWithToday: boolean = true;
  activeDayIsOpen: boolean = true;
  excludeDays: number[] = []; // [0];
  weekendDays: number[] = [0, 6];
  dayStartHour: number = 0;
  dayEndHour: number = 23;

  minDate: Date = endOfDay(addMonths(new Date(), -1));
  maxDate: Date = endOfDay(addMonths(new Date(), 1));
  dayModifier: Function;
  hourModifier: Function;
  segmentModifier: Function;
  prevBtnDisabled: boolean = false;
  nextBtnDisabled: boolean = false;
  events: CalendarSchedulerEvent[];
  actions: CalendarSchedulerEventAction[] = [];

  constructor(@Inject(LOCALE_ID) locale: string, private dateAdapter: DateAdapter, private complejoSharedService: ComplejoSharedService,
              private reservaService: ReservaService, private dialog: MatDialog, private snackbar: MatSnackBar, private datePipe: DatePipe,
              private schedulerService: SchedulerService) {
    this.locale = locale;
    this.configurarScheduler();
  }

  /*CONFIGURACION DE DIAS Y SEGMENTOS A DESHABILITAR SEGUN HORARIOS DE APERTURA Y CIERRE DEL COMPLEJO*/
  configurarScheduler() {
    //CONFIGURO LOS DIAS DE ATENCION
    this.dayModifier = ((day: SchedulerViewDay): void => {
      let diasExcluidos: number[] = [];
      if (!this.complejo.diasAtencion.domingo) {
        diasExcluidos.push(0);
      }
      if (!this.complejo.diasAtencion.lunes) {
        diasExcluidos.push(1);
      }
      if (!this.complejo.diasAtencion.martes) {
        diasExcluidos.push(2);
      }
      if (!this.complejo.diasAtencion.miercoles) {
        diasExcluidos.push(3);
      }
      if (!this.complejo.diasAtencion.jueves) {
        diasExcluidos.push(4);
      }
      if (!this.complejo.diasAtencion.viernes) {
        diasExcluidos.push(5);
      }
      if (!this.complejo.diasAtencion.sabado) {
        diasExcluidos.push(6);
      }
      this.excludeDays = diasExcluidos;
      /*  console.log(diasExcluidos);
        console.log(diasExcluidos.includes(day.date.getDay()));
        day.backgroundColor = diasExcluidos.includes(day.date.getDay()) ? '#9e9e9e' : '#FFFFFF';*/
    }).bind(this);

    //CONFIGURO LOS HORARIOS
    this.dayStartHour = 0;
    this.dayEndHour = 23;
    this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
      if (this.complejo.cierre > this.complejo.apertura) { //SI ES UN HORARIO CONTINUO LO CORTO SEGUN APERTURA Y CIERRE
        this.dayStartHour = Number(this.complejo.apertura.substring(0, 2));
        this.dayEndHour = Number(this.complejo.cierre.substring(0, 2));
      } else {
        //SI NO ES HORARIO CONTINUO PINTO DE NEGRO EL MEDIO DURANTE EL CUAL ESTA CERRADO
        if (segment.date.getHours() >= Number(this.complejo.cierre.substring(0, 2)) &&
          segment.date.getHours() < Number(this.complejo.apertura.substring(0, 2))) {
          segment.isDisabled = true;
          segment.backgroundColor = '#9e9e9e';
        }
      }

    }).bind(this);
  }


  ngOnInit(): void {
    this.schedulerService.cargarReservasEnScheduler(this.actions, this.reservas)
      .then((events: CalendarSchedulerEvent[]) => this.events = events);

    this.reservaService.reservasCambio.subscribe(reservas => {
      this.reservas = reservas;
      this.schedulerService.cargarReservasEnScheduler(this.actions, this.reservas)
        .then((events: CalendarSchedulerEvent[]) => this.events = events);
    });
  }

  changeDate(date: Date): void {
    console.log('changeDate', date);
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  changeView(view: CalendarView): void {
    console.log('changeView', view);
    this.view = view;
    this.dateOrViewChanged();
  }

  dateOrViewChanged(): void {
    console.log(this.viewDate);
    if (this.startsWithToday) {
      this.prevBtnDisabled = !this.isDateValid(subPeriod(this.dateAdapter, this.view, this.viewDate, 1));
      this.nextBtnDisabled = !this.isDateValid(addPeriod(this.dateAdapter, this.view, this.viewDate, 1));
    } else {
      this.prevBtnDisabled = !this.isDateValid(endOfPeriod(this.dateAdapter, this.view, subPeriod(this.dateAdapter, this.view, this.viewDate, 1)));
      this.nextBtnDisabled = !this.isDateValid(startOfPeriod(this.dateAdapter, this.view, addPeriod(this.dateAdapter, this.view, this.viewDate, 1)));
    }
    if (this.viewDate < this.minDate) {
      this.changeDate(this.minDate);
    } else if (this.viewDate > this.maxDate) {
      this.changeDate(this.maxDate);
    }
    this.cargarReservasXCambioSemana();
  }

  private isDateValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  viewDaysChanged(viewDays: number): void {
    console.log('viewDaysChanged', viewDays);
    this.viewDays = viewDays;
  }

  dayHeaderClicked(day: SchedulerViewDay): void {
    console.log('dayHeaderClicked Day', day);
  }

  hourClicked(hour: SchedulerViewHour): void {
    console.log('hourClicked Hour', hour);
  }

  segmentClicked(action: string, segment: SchedulerViewHourSegment): void {
    console.log('segmentClicked Action', action);
    console.log('segmentClicked Segment', segment);
    if (this.cancha == null || this.cancha == undefined) {
      this.snackbar.open('Debe seleccionar una cancha', 'Info', {
        duration: 5000
      });
    } else {
      if (segment.date < new Date()) {
        this.snackbar.open('No puedes crear reservas en días y horarios pasados', 'Info', {
          duration: 5000
        });
      } else {
        this.dialog.open(NuevaComponent, {
          width: '380px',
          data: {
            fechaReserva: segment.date,
            complejo: this.complejo,
            cancha: this.cancha,
            reservaEdicion: this.reservaEdicion
          },
          disableClose: true
        });
      }
    }
  }

  eventClicked(action: string, event: CalendarSchedulerEvent): void {
    console.log('eventClicked Action', action);
    console.log('eventClicked Event', event);
    this.dialog.open(DetalleComponent, {
      width: '350px',
      data: event.content,
      disableClose: true
    });
  }

  eventTimesChanged({event, newStart, newEnd}: SchedulerEventTimesChangedEvent): void {
    console.log('eventTimesChanged Event', event);
    console.log('eventTimesChanged New Times', newStart, newEnd);
    let ev = this.events.find(e => e.id === event.id);
    ev.start = newStart;
    ev.end = newEnd;
    this.refresh.next();
  }

  public cargarReservasXCambioSemana() {
    this.fecha = new Date(this.viewDate);
    const fechaIniFormateada = this.datePipe.transform(this.fecha, 'dd-MM-yyyy');
    let fechaFin = this.fecha;
    fechaFin.setDate(fechaFin.getDate() + 6);
    const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
    console.log(fechaIniFormateada);
    console.log(fechaFinFormateada);
    this.reservaService.verDisponibilidadxSemana(this.complejo.idComplejo, this.cancha.idCancha, fechaIniFormateada,
      fechaFinFormateada).subscribe(reservas => {
      this.reservaService.reservasCambio.next(reservas);
      console.log(reservas);
    });
  }

}
