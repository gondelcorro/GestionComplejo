import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TurnoFijoService} from '../../../../service/turno-fijo.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-cancelar-fecha',
    templateUrl: './cancelar-fecha.component.html',
    styleUrls: ['./cancelar-fecha.component.css'],
    standalone: false
})
export class CancelarFechaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<CancelarFechaComponent>,
              private turnoFijoService: TurnoFijoService, private snackBaar: MatSnackBar) { }

  ngOnInit(): void {
  }

  public confirmarCancelarFecha(){
    console.log(this.data.idTurnoFijo);
    this.turnoFijoService.cancelarFecha(this.data.reserva, this.data.idTurnoFijo).subscribe(resp =>{
      if(resp == 1){
        this.snackBaar.open('Su cancelación de fecha a sido exitosa.', 'INFO', {
          duration: 5000
        });
        this.turnoFijoService.obtenerTurnoFijo(this.data.idTurnoFijo).subscribe(turno =>{
          //para actualizar el detalle del turno fijo cuando se modifica el turno fijo
          this.turnoFijoService.turnoFijoCambio.next(turno);
        });
      }else{
        this.snackBaar.open('No se pudo cancelar la fecha.', 'ERROR', {
          duration: 5000
        });
      }
    });
    this.dialogRef.close();
  }

}
