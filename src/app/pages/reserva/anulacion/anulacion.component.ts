import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReservaComponent} from '../reserva.component';
import {ReservaService} from '../../../service/reserva.service';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-anulacion',
    templateUrl: './anulacion.component.html',
    styleUrls: ['./anulacion.component.css'],
    standalone: false
})
export class AnulacionComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private reservaService: ReservaService,
              private snackbar: MatSnackBar, private dialogRef: MatDialogRef<ReservaComponent>, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
  }

  confirmarAnulacion() {
    this.reservaService.anular(this.data.reserva).subscribe(anulacion => {
      if (anulacion == 1) {
        this.dialogRef.close();
        let fechaInicio = new Date();
        const fechaInicioFormateada = this.datePipe.transform(fechaInicio, 'dd-MM-yyyy');
        let fechaFin = new Date();
        fechaFin.setDate(fechaFin.getDate()+6);
        const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
        this.reservaService.verDisponibilidadxSemana(this.data.reserva.complejo.idComplejo, this.data.reserva.cancha.idCancha,
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
