import { TipoCancha } from './../../../model/tipoCancha';
import { ComplejoSharedService } from './../../../service/complejo-shared.service';
import { Cancha } from './../../../model/cancha';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanchaService } from 'src/app/service/cancha.service';

@Component({
    selector: 'app-edicion',
    templateUrl: './edicion.component.html',
    styleUrls: ['./edicion.component.css'],
    standalone: false
})
export class EdicionComponent implements OnInit {

  cancha: Cancha;
  tipoCancha = TipoCancha;
  tipoCanchaOpc: string[] = [];
  textEstadoCancha: string = "";

  // PARA RECIBIR EN EL DIALOGO LOS DATOS Q VIENEN DEL COMPONENTE PADRE, EL MATDIALOGREF Y EL @INJECT
  constructor(public dialogRef: MatDialogRef<EdicionComponent>, @Inject(MAT_DIALOG_DATA) public canchaSelect: Cancha,
    private canchaService: CanchaService, private snackBar: MatSnackBar, private complejoSharedService: ComplejoSharedService) {

    this.tipoCanchaOpc = Object.values(this.tipoCancha); // Uso la clase Object y values muetra el valor del objeto Enum (keys me recupera las llaves)
  }

  ngOnInit(): void {
    this.cancha = new Cancha();
    this.cancha.idCancha = this.canchaSelect.idCancha;// a la nueva instancia hay q setearle el id para q el back sepa q es una editar
    this.cancha.complejo = this.canchaSelect.complejo;
    this.cancha.numero = this.canchaSelect.numero;
    this.cancha.tipo = this.canchaSelect.tipo;
    this.cancha.precioDia = this.canchaSelect.precioDia;
    this.cancha.precioNoche = this.canchaSelect.precioNoche;
    this.cancha.habilitada = this.canchaSelect.habilitada;
    if(this.cancha.idCancha == null){
      this.cancha.habilitada = true; this.textEstadoCancha = 'Habilitada';
    }else{
      this.textEstadoCancha = this.cancha.habilitada ? 'Habilitada' : 'Deshabilitada';
    }
  }

  async operar() {
    let idComplejo = this.complejoSharedService.getComplejo().idComplejo;
    if (this.cancha.idCancha != null) {
      console.log(this.cancha);
      this.canchaService.editar(this.cancha).subscribe(rpta => {
        if (rpta === 1) {
          this.canchaService.listarPorComplejo(idComplejo).subscribe(canchas => {
            this.canchaService.canchaCambio.next(canchas);
            this.snackBar.open("Se editó correctamente", "Aviso", { duration: 3000 });
            this.dialogRef.close();
          });
        } else {
          this.snackBar.open("No se editó", "Aviso", { duration: 3000 });
        }
      });
    } else {
      this.cancha.complejo = this.complejoSharedService.getComplejo();
      this.canchaService.registrar(this.cancha).subscribe(idCancha => {
        if (idCancha != 0) {
          this.canchaService.listarPorComplejo(idComplejo).subscribe(canchas => {
            this.canchaService.canchaCambio.next(canchas);
            this.snackBar.open("Se registró correctamente", "Aviso", { duration: 3000 });
            this.dialogRef.close();
          });
        } else {
          this.snackBar.open("No se pueden registrar dos canchas con el mismo número", "Aviso", { duration: 3000 });
        }
      });
    }
  }

  cancelar() {
    this.dialogRef.close();
  }

}
