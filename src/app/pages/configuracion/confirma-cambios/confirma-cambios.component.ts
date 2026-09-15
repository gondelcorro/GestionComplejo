import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ComplejoService} from '../../../service/complejo.service';
import {DatePipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-confirma-cambios',
    templateUrl: './confirma-cambios.component.html',
    styleUrls: ['./confirma-cambios.component.css'],
    standalone: false
})
export class ConfirmaCambiosComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<ConfirmaCambiosComponent>,
              private complejoService: ComplejoService, private datePipe: DatePipe, private snackbar: MatSnackBar) { }

  ngOnInit(): void {

  }

  public confirmarCambios(){
    let cierreAsDate = new Date();
    let finAsDate = new Date();
    if (this.data.horaCierre == 0 || this.data.horaFin == 0) {
      cierreAsDate.setHours(23, 59);
      finAsDate.setHours(23, 59);
      this.data.complejo.cierre = this.datePipe.transform(cierreAsDate, 'HH:mm');
      this.data.complejo.diurnoFin = this.datePipe.transform(finAsDate, 'HH:mm');
    }
    if(!this.data.complejo.cierreTemporal){
      this.data.complejo.cierreTempHasta = null;
    }
    this.complejoService.modificarComplejo(this.data.complejo).subscribe(complejo => {
      this._guardarArchivo(complejo.idComplejo);
      this.complejoService.complejoCambio.next(complejo);
    });
  }

  private _guardarArchivo(idComplejo: number) {
    const formData = new FormData();
    formData.append('imagen', this.data.imagen);
    formData.append('logo', this.data.logo);
    this.complejoService.guardarArchivo(formData, idComplejo).subscribe(data => {
      if (data == '1') {
        this.dialogRef.close();
        this.snackbar.open('Se modificaron los datos exitosamente', 'Aviso', {duration: 3000});
      } else {
        this.snackbar.open('Error al registrar la imagen', 'Aviso', {duration: 3000});
      }
    });
  }

}
