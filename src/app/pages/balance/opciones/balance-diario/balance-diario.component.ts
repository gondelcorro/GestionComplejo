import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ComplejoService} from '../../../../service/complejo.service';
import {environment} from '../../../../../environments/environment';
import {Complejo} from '../../../../model/complejo';
import {ComplejoSharedService} from '../../../../service/complejo-shared.service';
import {MatSort} from '@angular/material/sort';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {UntypedFormControl} from '@angular/forms';
import {BalanceService} from '../../../../service/balance.service';
import {DatePipe} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-balance-diario',
  templateUrl: './balance-diario.component.html',
  styleUrls: ['./balance-diario.component.css']
})
export class BalanceDiarioComponent implements OnInit {

  complejo: Complejo;
  balanceDiario: any;
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
  date = new UntypedFormControl(new Date());
  @ViewChild(MatSort) sort: MatSort;

  constructor(private balanceService: BalanceService, private complejoService: ComplejoService, private  complejoSharedService: ComplejoSharedService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo => {
      this.complejo = complejo;
      this.complejoSharedService.setComplejo(this.complejo);
      this.getBalanceDiario(this.date.value);
    });
  }

  getBalanceDiario(fecha) {
    const date = this.datePipe.transform(fecha, 'dd-MM-yyyy');
    this.balanceService.obtenerBalanceDiario(this.complejo.idComplejo, date).subscribe(balance => {
      this.balanceDiario = new MatTableDataSource(balance);
    });
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.getBalanceDiario(event.value);
  }

  getTotalForColum(column) {
    let dataProd = this.balanceDiario?.data?.map(prod => prod[column]).reduce((accum, value) => +accum + +value, 0);
    return dataProd;
  }

  generarPdf() {
    const fechaFormateada = this.datePipe.transform(this.date.value, 'dd-MM-yyyy');
    this.balanceService.generarPdfBalanceDiario(this.complejo.idComplejo, fechaFormateada).subscribe(dataReporte => {
      const file = new Blob([dataReporte], {type: "application/pdf"})
      const fileUrl = window.URL.createObjectURL(file);
      window.open(fileUrl);
    });
  }

}
