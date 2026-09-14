import {Component, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import {Complejo} from '../../../../model/complejo';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {ComplejoService} from '../../../../service/complejo.service';
import {ComplejoSharedService} from '../../../../service/complejo-shared.service';
import {environment} from '../../../../../environments/environment';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatTableDataSource} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {BalanceService} from '../../../../service/balance.service';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import {DateAdapter} from '@angular/material/core';

@Injectable()
export class FiveDayRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, -3);
      const end = this._dateAdapter.addCalendarDays(date, 3);
      return new DateRange<D>(start, end);
    }
    return new DateRange<D>(null, null);
  }
}

@Component({
  selector: 'app-balance-semanal',
  templateUrl: './balance-semanal.component.html',
  styleUrls: ['./balance-semanal.component.css'],
  providers: [{
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: FiveDayRangeSelectionStrategy
  }]
})
export class BalanceSemanalComponent implements OnInit {

  complejo: Complejo;
  balanceSemanal: any;
  columnsGroupHeader: string[] = ['canchas', 'Reservas', 'Pagos', 'Movimientos', 'saldos'];
  columnsToDisplay: any[] = [
    {idCol: 'numCancha', titleCol: 'Cancha N°'},
    {idCol: 'cantReservasConfirmadas', titleCol: 'Finalizadas'},
    {idCol: 'cantReservasAnuladas', titleCol: 'Anuladas'},
    {idCol: 'cantPagosAprobados', titleCol: 'Aprobados'},
    {idCol: 'cantPagosAnulados', titleCol: 'Reintegros'},
    {idCol: 'ingresos', titleCol: 'Ingresos'},
    {idCol: 'egresos', titleCol: 'Egresos'},
    {idCol: 'saldo', titleCol: 'Saldo'}
  ];
  columnsToDisplayMap: any[] = this.columnsToDisplay.map(col => col.idCol);
  range: UntypedFormGroup;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private balanceService: BalanceService, private complejoService: ComplejoService, private  complejoSharedService: ComplejoSharedService,
              private datePipe: DatePipe) {
    let fechaIni = new Date();
    fechaIni.setDate(fechaIni.getDate()-3);
    let fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate()+3);
    this.range = new UntypedFormGroup({
      inicio: new UntypedFormControl(fechaIni),
      fin: new UntypedFormControl(fechaFin)
    });
  }

  ngOnInit(): void {
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo => {
      this.complejo = complejo;
      this.complejoSharedService.setComplejo(this.complejo);
      /*MUESTRO LAS DOS FORMAS DE OBTENER EL VALUE DE LOS FORM CONTROLS DE UN FORM GROUP*/
      this.getBalanceSemanal(this.range.get('inicio').value, this.range.controls['fin'].value);
    });
  }

  inicioChange(event:MatDatepickerInputEvent<Date>){
    this.range.get('inicio').setValue(event.value);
  }
  finChange(event:MatDatepickerInputEvent<Date>){
    this.range.get('fin').setValue(event.value);
    this.getBalanceSemanal(this.range.get('inicio').value, this.range.controls['fin'].value);
  }

  getBalanceSemanal(fechaIni, fechaFin) {
    const dateIni = this.datePipe.transform(fechaIni, 'dd-MM-yyyy');
    const dateFin = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
    this.balanceService.obtenerBalanceSemanal(this.complejo.idComplejo, dateIni, dateFin).subscribe(balance => {
      this.balanceSemanal = new MatTableDataSource(balance);
    });
  }

  getTotalForColum(column) {
    let dataProd = this.balanceSemanal?.data?.map(prod => prod[column]).reduce((accum, value) => +accum + +value, 0);
    return dataProd;
  }

  generarPdf() {
    /*    const fechaFormateada = this.datePipe.transform(this.fecha.value, 'yyyy-MM-dd');
        this.produccionDiariaService.generarPdfProduccionDiaria(fechaFormateada).subscribe(dataReporte => {
          const file = new Blob([dataReporte], {type: "application/pdf"})
          const fileUrl = window.URL.createObjectURL(file);
          window.open(fileUrl);
        });*/
  }

}
