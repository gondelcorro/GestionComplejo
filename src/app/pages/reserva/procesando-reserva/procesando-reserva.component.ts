import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ReservaService} from '../../../service/reserva.service';
import {Reserva} from '../../../model/reserva';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-procesando-reserva',
  templateUrl: './procesando-reserva.component.html',
  styleUrls: ['./procesando-reserva.component.css']
})
export class ProcesandoReservaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private reserva: Reserva, private dialogRef: MatDialogRef<ProcesandoReservaComponent>,
              private snackbar: MatSnackBar, private reservaService: ReservaService, private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.reservaManual(this.reserva);
  }

  private reservaManual(reserva: Reserva) {
    this.reservaService.registrarReservaManual(reserva).subscribe(resp => {
        this.dialogRef.close();
        if (resp = 1) {
          let fechaIni = new Date();
          const fechaIniFormateada = this.datePipe.transform(fechaIni, 'dd-MM-yyyy');
          let fechaFin = new Date();
          fechaFin.setDate(fechaFin.getDate() + 6);
          const fechaFinFormateada = this.datePipe.transform(fechaFin, 'dd-MM-yyyy');
          console.log(fechaFinFormateada);
          this.reservaService.verDisponibilidadxSemana(reserva.complejo.idComplejo, reserva.cancha.idCancha, fechaIniFormateada,
            fechaFinFormateada).subscribe(reservas => {
            this.reservaService.reservasCambio.next(reservas);
          });
          this.snackbar.open('Se registró la reserva correctamente', 'Aviso', {
            duration: 7000, horizontalPosition: 'center', panelClass: ['background-snackbar', 'text-snackbar']
          });
        } else {
          this.snackbar.open('Falló el registro de reserva en el sistema', 'Aviso', {
            duration: 7000, horizontalPosition: 'center', panelClass: ['background-snackbar', 'text-snackbar']
          });
        }

      }
    );
  }

}
