import { ComplejoSharedService } from './../../service/complejo-shared.service';
import { PagoService } from './../../service/pago.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  listaPago: any; //Uso tipo any para poder instanciarlo como MatTableDataSource y usar el filtro, sino puede ser tipo lista  listaAlu: Alumno[] = [];
  displayedColumns: string[] = ['NumRef', 'Estado', 'MedioPago', 'Importe', 'Fecha'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private pagoService: PagoService, private complejoSharedService: ComplejoSharedService) { }

  ngOnInit(): void {
    this.listar();
    this.pagoService.pagoCanmbio.subscribe(data => {
      this.listaPago.data = data;
      this.listaPago = new MatTableDataSource(this.listaPago);
      this.listaPago.sort = this.sort;
    });
  }

  listar() {
    let idComplejo = this.complejoSharedService.getComplejo().idComplejo;
    this.pagoService.listarPorComplejo(idComplejo).subscribe(data => {
      this.listaPago = new MatTableDataSource();
      this.listaPago.data = data;
      this.listaPago.sort = this.sort;
    })
  }

}
