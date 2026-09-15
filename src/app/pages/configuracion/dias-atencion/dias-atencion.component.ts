import {Component, Inject, OnInit} from '@angular/core';
import {Complejo} from '../../../model/complejo';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {DiasAtencion} from '../../../model/diasAtencion';

@Component({
    selector: 'app-dias-atencion',
    templateUrl: './dias-atencion.component.html',
    styleUrls: ['./dias-atencion.component.css'],
    standalone: false
})

export class DiasAtencionComponent implements OnInit {

  diasSemana: any[] = [];
  complejo: Complejo;
  diasAtencion = new DiasAtencion();

  constructor(private bottomSheetRef: MatBottomSheetRef<DiasAtencionComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.complejo = this.data.complejoSelect;
    this.diasSemana = [
      {nomDia: 'Lunes', checked: this.complejo.diasAtencion.lunes},
      {nomDia: 'Martes', checked: this.complejo.diasAtencion.martes},
      {nomDia: 'Miercoles', checked: this.complejo.diasAtencion.miercoles},
      {nomDia: 'Jueves', checked: this.complejo.diasAtencion.jueves},
      {nomDia: 'Viernes', checked: this.complejo.diasAtencion.viernes},
      {nomDia: 'Sabado', checked: this.complejo.diasAtencion.sabado},
      {nomDia: 'Domingo', checked: this.complejo.diasAtencion.domingo}
    ];
  }

  public cambiarDias(diasSleccionados) {
    let diasSelect: string[] = [];
    diasSleccionados.forEach(dia => {
      diasSelect.push(dia.value.nomDia);
    });
    this.diasAtencion.lunes = diasSelect.includes('Lunes')  ? true : false;
    this.diasAtencion.martes =  diasSelect.includes( 'Martes') ? true : false;
    this.diasAtencion.miercoles =  diasSelect.includes('Miercoles') ? true : false;
    this.diasAtencion.jueves =  diasSelect.includes('Jueves') ? true : false;
    this.diasAtencion.viernes =  diasSelect.includes( 'Viernes') ? true : false;
    this.diasAtencion.sabado =  diasSelect.includes('Sabado') ? true : false;
    this.diasAtencion.domingo =  diasSelect.includes('Domingo') ? true : false;
    //console.log(this.diasAtencion);
    this.bottomSheetRef.dismiss(this.diasAtencion);
  }

}
