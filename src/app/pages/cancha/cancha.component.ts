import { ComplejoSharedService } from './../../service/complejo-shared.service';
import { EdicionComponent } from './edicion/edicion.component';
import { Cancha } from './../../model/cancha';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanchaService } from 'src/app/service/cancha.service';
import {Complejo} from '../../model/complejo';
import {ComplejoService} from '../../service/complejo.service';
import {environment} from '../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeshabilitarComponent} from './deshabilitar/deshabilitar.component';

@Component({
    selector: 'app-cancha',
    templateUrl: './cancha.component.html',
    styleUrls: ['./cancha.component.css'],
    standalone: false
})
export class CanchaComponent implements OnInit {

  complejo: Complejo;
  public canchas: Cancha[] = [];  /*  public canchas: Array<Cancha> = new Array(); */

  constructor(private canchaService: CanchaService, private complejoSharedService: ComplejoSharedService,
              private dialog: MatDialog, private complejoService: ComplejoService, private snackbar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).subscribe(complejo =>{
      this.listarCanchas(complejo.idComplejo);
      this.complejoSharedService.setComplejo(complejo);
    });
    //Para actualizar la lista cuando se edita desde el modal
    this.canchaService.canchaCambio.subscribe(data => {
      this.canchas = data;
    });
  }

  listarCanchas(idComplejo: number) {
    this.canchaService.listarPorComplejo(idComplejo).subscribe(data => {
      this.canchas = data;
    });
  }

  abrirDialog(cancha: Cancha): void {
    let canchaSelect = cancha != null ? cancha : new Cancha(); //control para modo editar o registro
    let dialogRef = this.dialog.open(EdicionComponent, {
      width: '350px',
      disableClose: false,
      data: canchaSelect
    });
  }

  habilitar(cancha: Cancha){
    cancha.habilitada = true;
    cancha.fechaDeshabilitada = null;
    this.canchaService.editar(cancha).subscribe(result => {
      if(result == 1){
        this.snackbar.open("Se habilitó la cancha correctamente", 'Aviso', {duration: 4000});
      }else{
        this.snackbar.open("No se habilitó la cancha", 'Error', {duration: 4000});
      }
    });
  }

  deshabilitar(canchaSelect: Cancha){
    let dialogRef = this.dialog.open(DeshabilitarComponent, {
      width: '450px',
      disableClose: false,
      data: canchaSelect
    });
  }

}
