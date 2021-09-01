import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent implements OnInit {

  tituloButtonToogle: string = 'Balance diario';
  selectedFilterProd: string;

  constructor(private router: Router) {
    this.selectedFilterProd = 'Balance diario';
  }

  ngOnInit(): void {
  }

  public onValChange(val: string) {
    /*PRIMERO SE MODIFICA EL VALOR SELECCIONADO Q SE PASA AL COMPONENTE HIJO (Opciones) POR @INPUT Y SE ACTUALIZA LA VISTA
     CON LAS TABLAS SEGUN CORRESPONDA POR EL *ngIf */
    this.selectedFilterProd = val;
    /*DESPUES SE MODIFICA LA RUTA Q ESTAN DEFINIDAS EN EL APP.ROUTING*/
    switch (val) {
      case 'Balance diario': this.router.navigate(['main-layout/balance/balance-diario']);
        break;
      case 'Balance semanal': this.router.navigate(['main-layout/balance/balance-semanal']);
        break;
      case 'Balance mensual': this.router.navigate(['main-layout/balance/balance-mensual']);
        break;
      default:
        break;
    }
  }

}
