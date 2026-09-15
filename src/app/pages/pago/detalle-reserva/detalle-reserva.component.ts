import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Pago} from '../../../model/pago';
import {Reserva} from '../../../model/reserva';
import {PagoService} from '../../../service/pago.service';

@Component({
    selector: 'app-detalle-reserva',
    templateUrl: './detalle-reserva.component.html',
    styleUrls: ['./detalle-reserva.component.css'],
    standalone: false
})
export class DetalleReservaComponent implements OnInit {

  public reserva: Reserva;

  constructor(@Inject(MAT_DIALOG_DATA) private pago: Pago, private pagoService: PagoService) { }

  ngOnInit(): void {
    this.pagoService.detalleReserva(this.pago.externalReference).subscribe(reserva =>{
      this.reserva = reserva;
    });
  }

  public cerrar(){

  }
}
