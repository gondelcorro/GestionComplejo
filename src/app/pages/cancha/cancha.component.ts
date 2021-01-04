import { ComplejoSharedService } from './../../service/complejo-shared.service';
import { EdicionComponent } from './edicion/edicion.component';
import { Cancha } from './../../model/cancha';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanchaService } from 'src/app/service/cancha.service';

@Component({
  selector: 'app-cancha',
  templateUrl: './cancha.component.html',
  styleUrls: ['./cancha.component.css']
})
export class CanchaComponent implements OnInit {

  /*  public canchas: Array<Cancha> = new Array(); */
  public canchas: Cancha[];
  /*   private cancha: Cancha;  */

  constructor(private canchaService: CanchaService, private complejoSharedService: ComplejoSharedService, 
    private dialog: MatDialog) {

    /*     this.cancha = new Cancha();
        this.cancha.idComplejo = 1;
        this.cancha.numero = 3;
        this.cancha.precioDia = 2500;
        this.cancha.precioNoche = 3000;
        this.cancha.tipo = "Futbol 8";
        this.canchas.push(this.cancha);
    
         this.cancha = new Cancha();
         this.cancha.idComplejo = 1;
         this.cancha.numero = 5;
         this.cancha.precioDia = 1800;
         this.cancha.precioNoche = 2000;
         this.cancha.tipo = "Futbol 5";
         this.canchas.push(this.cancha); */

  }

  ngOnInit(): void {
    this.listarCanchas();
    //Para actualizar la lista cuando se edita desde el modal
    this.canchaService.canchaCanmbio.subscribe(data => {
      this.canchas = data;
    });
  }

  listarCanchas() {
    let idComplejo = this.complejoSharedService.getComplejo().idComplejo;
    this.canchaService.listarPorComplejo(idComplejo).subscribe(data => {
      this.canchas = data;
    });
  }

  abrirDialog(cancha: Cancha): void {
    let canchaSelect = cancha != null ? cancha : new Cancha(); //control para modo edicion o registro
    let dialogRef = this.dialog.open(EdicionComponent, {
      width: '350px',
      disableClose: false,
      data: canchaSelect
    });
  }

}
