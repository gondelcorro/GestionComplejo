import { ComplejoSharedService} from '../../../service/complejo-shared.service';
import { PagoService} from '../../../service/pago.service';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {DetalleReservaComponent} from '../detalle-reserva/detalle-reserva.component';
import {MatPaginator} from '@angular/material/paginator';
import {ComplejoService} from '../../../service/complejo.service';
import {environment} from '../../../../environments/environment';
import {Pago} from '../../../model/pago';

@Component({
  selector: 'pago-turno-fijo',
  templateUrl: './turno-fijo.component.html',
  styleUrls: ['./turno-fijo.component.css']
})
export class PagoTurnoFijoComponent implements OnInit, AfterViewInit {

  listaPago: any; //Uso tipo any para poder instanciarlo como MatTableDataSource y usar el filtro, sino puede ser tipo lista  listaAlu: Alumno[] = [];
  displayedColumns: string[] = ['Reintegro', 'NumPago', 'Estado', 'MedioPago', 'Importe', 'Fecha', 'Acciones'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  cantidad: number;

  constructor(private pagoService: PagoService, private complejoService: ComplejoService, private complejoSharedService: ComplejoSharedService,
              private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo => {
      this.complejoSharedService.setComplejo(complejo);
      this.listar(complejo.idComplejo);
    });
  }

  ngAfterViewInit() {
    this.listaPago.paginator = this.paginator;
    this.listaPago.sort = this.sort;
  }

  listar(idComplejo: number) {
    this.pagoService.listarPorComplejoTF(idComplejo).subscribe(pagos => {
      this.listaPago = new MatTableDataSource(pagos);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.listaPago.filter = filterValue.trim().toLowerCase();
    if (this.listaPago.paginator) {
      this.listaPago.paginator.firstPage();
    }
  }

  verReserva(pago: Pago){
    let dialogRef = this.dialog.open(DetalleReservaComponent, {
      width: '350px',
      disableClose: true,
      data: pago
    });
  }

}
