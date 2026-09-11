import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Complejo} from '../../../../model/complejo';
import {Cancha} from '../../../../model/cancha';
import {UntypedFormControl} from '@angular/forms';
import {MatSort} from '@angular/material/sort';
import {ComplejoService} from '../../../../service/complejo.service';
import {ComplejoSharedService} from '../../../../service/complejo-shared.service';
import {environment} from '../../../../../environments/environment';
import {MatDatepicker, MatDatepickerInputEvent} from '@angular/material/datepicker';
import {Moment} from 'moment';
import {MAT_DATE_FORMATS} from '@angular/material/core';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {BalanceService} from '../../../../service/balance.service';
import {DatePipe} from '@angular/common';

import * as _moment from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-balance-mensual',
  templateUrl: './balance-mensual.component.html',
  styleUrls: ['./balance-mensual.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class BalanceMensualComponent implements OnInit {

  complejo: Complejo;
  balanceMensual: any;
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
  date = new UntypedFormControl(moment());
  @ViewChild(MatSort) sort: MatSort;

  constructor(private balanceService: BalanceService, private complejoService: ComplejoService, private complejoSharedService: ComplejoSharedService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo => {
      this.complejo = complejo;
      this.complejoSharedService.setComplejo(this.complejo);
      this.getBalanceMensual(this.date.value);
    });
  }

  getBalanceMensual(fecha) {
    const date = this.datePipe.transform(fecha, 'dd-MM-yyyy');
    this.balanceService.obtenerBalanceMensual(this.complejo.idComplejo, date).subscribe(balance => {
      this.balanceMensual = new MatTableDataSource(balance);
    });
  }

  getTotalForColum(column) {
    let dataProd = this.balanceMensual?.data?.map(prod => prod[column]).reduce((accum, value) => +accum + +value, 0);
    return dataProd;
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.getBalanceMensual(this.date.value);
    datepicker.close();
  }

  generarPdf() {
    const fechaFormateada = this.datePipe.transform(this.date.value, 'dd-MM-yyyy');
    this.balanceService.generarPdfBalanceMensual(this.complejo.idComplejo, fechaFormateada).subscribe(dataReporte => {
      const file = new Blob([dataReporte], {type: 'application/pdf'});
      const fileUrl = window.URL.createObjectURL(file);
      window.open(fileUrl);
    });
  }

}
