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
  styleUrls: ['./edicion.component.css']
})
export class EdicionComponent implements OnInit {

  cancha: Cancha;
  tipoCancha = TipoCancha;
  tipoCanchaOpc: string[] = [];

  //PARA RECIBIR EN EL DIALOGO LOS DATOS Q VIENEN DEL COMPONENTE PADRE, EL MATDIALOGREF Y EL @INJECT
  constructor(public dialogRef: MatDialogRef<EdicionComponent>,
    @Inject(MAT_DIALOG_DATA) public canchaSelect: Cancha,
    private canchaService: CanchaService, private snackBar: MatSnackBar,
    private complejoSharedService: ComplejoSharedService) {

    //Uso la clase Object y values muetra el valor del objeto Enum (keys me recupera las llaves)
    this.tipoCanchaOpc = Object.values(this.tipoCancha);
  }

  ngOnInit(): void {
    //ASIGO EN LIBRO LA DATA Q VIENE DE LA TABLA PARA PODER MOSTRARLA EN EL HTML
    //LO HAGO ASI CREANDO UNA NUEVA INSTANCIA XQ SINO LOS CAMBIOS SE VERAN TB EN LA TABLA EN TPO REAL MIENTRAS MODIFICO
    this.cancha = new Cancha();
    this.cancha.complejo = this.canchaSelect.complejo;// a la nueva instancia hay q setearle el id para q el back sepa q es una edicion
    this.cancha.numero = this.canchaSelect.numero;
    this.cancha.tipo = this.canchaSelect.tipo;
    this.cancha.precioDia = this.canchaSelect.precioDia;
    this.cancha.precioNoche = this.canchaSelect.precioNoche;
  }

  //la llamada q se hace a los services a traves de http es siempre asincrona
  //por lo tanto si quiero esperar la resp del service para desp ejecutar otra funcion
  //antepongo la palabra async en el metodo grl y await + .toPromise en la llamada al service
  async operar() {
    let idComplejo = this.complejoSharedService.getComplejo().idComplejo;
    if (this.cancha != null && this.cancha.complejo != undefined) {
      this.canchaService.editar(this.cancha).subscribe(rpta => {
        if (rpta === 1) {
          this.canchaService.listarPorComplejo(idComplejo).subscribe(canchas => {
            this.canchaService.canchaCanmbio.next(canchas);
            this.snackBar.open("Se editó correctamente", "Aviso", { duration: 3000 });
          });
        } else {
          this.snackBar.open("No se editó", "Aviso", { duration: 3000 });
        }
      });
    } else {
      console.log("COMPLEJO: " + this.complejoSharedService.getComplejo().nombre)
      console.log("TIPO CANCHA: " + this.cancha.tipo)
      this.cancha.complejo = this.complejoSharedService.getComplejo();
      this.canchaService.registrar(this.cancha).subscribe(data => {
        if (data != null) {
          this.canchaService.listarPorComplejo(idComplejo).subscribe(canchas => {
            this.canchaService.canchaCanmbio.next(canchas);
            this.snackBar.open("Se registró correctamente", "Aviso", { duration: 3000 });
          });
        } else {
          this.snackBar.open("No se registró", "Aviso", { duration: 3000 });
        }
      });

    }
    this.dialogRef.close();
  }

  cancelar() {
    this.dialogRef.close();
  }

}
