import {Component, Inject, OnInit} from '@angular/core';
import {Reserva} from '../../../model/reserva';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReservaComponent} from '../reserva.component';
import {ReservaService} from '../../../service/reserva.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-anulacion',
  templateUrl: './anulacion.component.html',
  styleUrls: ['./anulacion.component.css']
})
export class AnulacionComponent implements OnInit {

  reservaAAnular: Reserva;

  constructor(@Inject(MAT_DIALOG_DATA) private reservaSelected: Reserva, private reservaService: ReservaService,
              private snackbar: MatSnackBar, private dialogRef: MatDialogRef<ReservaComponent>, private datePipe: DatePipe) {
    this.reservaAAnular = this.reservaSelected;
  }


  ngOnInit(): void {
  }

  confirmarAnulacion() {
    this.reservaService.anular(this.reservaAAnular).subscribe(anulacion => {
      if (anulacion == 1) {
        this.dialogRef.close();
        let fechaInicio = new Date();
        const fechaInicioFormateada = this.datePipe.transform(fechaInicio, 'dd-MM-yyyy');
        let fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate()+6);
        const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
        this.reservaService.verDisponibilidadxSemana(this.reservaAAnular.complejo.idComplejo, this.reservaAAnular.cancha.idCancha,
          fechaInicioFormateada, fechaFinFormateada).subscribe(reservas => {
          this.reservaService.reservasCambio.next(reservas);
          this.snackbar.open('Se anuló correctamente su reserva', 'Aviso', {duration: 5000});
        });
      } else {
        this.snackbar.open('Error anulando la reserva', 'Error', {duration: 5000});
      }
    });
  }

}
