import {Component, Inject, OnInit} from '@angular/core';
import {ReservaService} from '../../../../service/reserva.service';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {TurnoFijoService} from '../../../../service/turno-fijo.service';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';

@Component({
  selector: 'app-abonar-fecha',
  templateUrl: './abonar-fecha.component.html',
  styleUrls: ['./abonar-fecha.component.css']
})
export class AbonarFechaComponent implements OnInit {

  importeAPagar = 0;

  constructor(private dialogRefAbonarFecha: MatDialogRef<AbonarFechaComponent>, @Inject(MAT_DIALOG_DATA) public reserva: any,
              private reservaService: ReservaService, private turnoFijoService: TurnoFijoService, private matBar: MatSnackBar) { }

  ngOnInit(): void {
    this.reservaService.calcularImporte(this.reserva).subscribe(importe => {
      this.importeAPagar = importe;
    });
  }

  public confirmarAbonarFecha(){
    this.turnoFijoService.abonarFecha(this.reserva).subscribe(fechaAbonada =>{
      if (fechaAbonada){
        this.matBar.open('Fecha abonada exitosamente', 'Info', {
          duration: 5000
        });
      }else{
        this.matBar.open('La fecha ya fue abonada', 'Error', {
          duration: 5000
        });
      }
    });
    this.dialogRefAbonarFecha.close();
  }

}
