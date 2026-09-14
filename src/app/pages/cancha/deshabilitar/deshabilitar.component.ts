import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {DatePipe} from '@angular/common';
import {CanchaService} from '../../../service/cancha.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Cancha} from '../../../model/cancha';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-deshabilitar',
  templateUrl: './deshabilitar.component.html',
  styleUrls: ['./deshabilitar.component.css']
})
export class DeshabilitarComponent implements OnInit {

  date = new UntypedFormControl(new Date());
  minDate = new Date();
  dateSelected;

  constructor(@Inject(MAT_DIALOG_DATA) private cancha: Cancha, private dialogRef: MatDialogRef<DeshabilitarComponent>, private datePipe: DatePipe,
              private canchaService: CanchaService, private snackbar: MatSnackBar) {

  }

  ngOnInit(): void {
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.dateSelected = this.datePipe.transform(event.value, 'dd-MM-yyyy');
  }

  confirmaDeshabilitar() {
    if (this.dateSelected == undefined) {
      this.dateSelected = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    }
    this.canchaService.deshabilitarCancha(this.cancha, this.dateSelected).subscribe(rpta => {
      if (rpta == 1) {
        this.canchaService.listarPorComplejo(this.cancha.complejo.idComplejo).subscribe(canchas => {
          this.canchaService.canchaCambio.next(canchas);
        });
        this.snackbar.open('Se deshabilitó la cancha correctamente. Puede volver a habilitarla en cualquier momento', 'Aviso', {duration: 5000});
      } else {
        this.snackbar.open('La cancha no se puede deshabilitar porque tiene reservas pendientes a partir de la fecha', 'Error', {duration: 5000});
      }
      this.dialogRef.close();
    });
  }

}
