import {Component, OnInit, Inject, LOCALE_ID, Input, OnChanges} from '@angular/core';
import {CalendarDateFormatter, CalendarView, CalendarViewPeriod, DateAdapter} from 'angular-calendar';
import {
  addPeriod, CalendarSchedulerEvent, CalendarSchedulerEventAction, DAYS_IN_WEEK, endOfPeriod, SchedulerDateFormatter,
  SchedulerEventTimesChangedEvent, SchedulerViewDay, SchedulerViewHour, SchedulerViewHourSegment,
  startOfPeriod, subPeriod
} from 'angular-calendar-scheduler';
import {addMonths, endOfDay} from 'date-fns';
import {Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Reserva} from '../../../../model/reserva';
import {Complejo} from '../../../../model/complejo';
import {Cancha} from '../../../../model/cancha';
import {ReservaService} from '../../../../service/reserva.service';
import {SchedulerService} from '../../../../service/scheduler.service';
import {DatePipe} from '@angular/common';
import {NuevaComponent} from '../../nueva/nueva.component';

@Component({
    selector: 'app-scheduler-edicion',
    templateUrl: './scheduler-edicion.component.html',
    styleUrls: ['./scheduler-edicion.component.css'],
    providers: [{
            provide: CalendarDateFormatter,
            useClass: SchedulerDateFormatter
        }],
    standalone: false
})
export class SchedulerEdicionComponent implements OnInit {

  @Input() reservas: Reserva[];
  @Input() complejo: Complejo;
  @Input() cancha: Cancha;
  @Input() fecha: Date;
  @Input() reservaEdicion: Reserva;

  view: CalendarView = CalendarView.Day;
  viewDate: Date = new Date();
  viewDays: number = 1; //DAYS_IN_WEEK

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

  constructor(@Inject(LOCALE_ID) locale: string, private dateAdapter: DateAdapter, private reservaService: ReservaService,
              private dialog: MatDialog, private schedulerService: SchedulerService, private snackbar: MatSnackBar, private datePipe: DatePipe) {
    this.locale = locale;
    this.configurarScheduler();
  }

  /*CONFIGURACION SEGMENTOS A DESHABILITAR SEGUN HORARIOS DE APERTURA Y CIERRE DEL COMPLEJO*/
  configurarScheduler() {
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
    const fechaFormateada = this.datePipe.transform(this.fecha, 'dd-MM-yyyy');
    this.reservaService.verDisponibilidad(this.complejo.idComplejo, this.cancha.idCancha, fechaFormateada).subscribe(reservas => {
      this.schedulerService.cargarReservasEnScheduler(this.actions, reservas)
        .then((events: CalendarSchedulerEvent[]) => this.events = events);
    });
    this.changeDate(new Date(this.fecha));

    this.reservaService.fechaCambio.subscribe(fechaCambio => {
      const fechaFormateada = this.datePipe.transform(fechaCambio, 'dd-MM-yyyy');
      this.changeDate(fechaCambio);
      this.reservaService.verDisponibilidad(this.complejo.idComplejo, this.cancha.idCancha, fechaFormateada).subscribe(reservas => {
        this.schedulerService.cargarReservasEnScheduler(this.actions, reservas)
          .then((events: CalendarSchedulerEvent[]) => this.events = events);
        this.changeDate(new Date(fechaCambio));
      });
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
    if (segment.date < new Date()) {
      this.snackbar.open('No puedes crear reservas en días y horarios pasados', 'Aviso', {
        duration: 5000
      });
    } else {
      const dialogRef = this.dialog.open(NuevaComponent, {
        width: '350px',
        data: {
          fechaReserva: segment.date,
          complejo: this.complejo,
          cancha: this.cancha,
          reservaEdicion: this.reservaEdicion
        },
        disableClose: true
      });
      dialogRef.afterClosed().subscribe( cerrar => {this.dialog.closeAll()});
    }
  }

  eventClicked(action: string, event: CalendarSchedulerEvent): void {
    console.log('eventClicked Action', action);
    console.log('eventClicked Event', event);
  }

  eventTimesChanged({event, newStart, newEnd}: SchedulerEventTimesChangedEvent): void {
    console.log('eventTimesChanged Event', event);
    console.log('eventTimesChanged New Times', newStart, newEnd);
    let ev = this.events.find(e => e.id === event.id);
    ev.start = newStart;
    ev.end = newEnd;
    this.refresh.next();
  }

}
