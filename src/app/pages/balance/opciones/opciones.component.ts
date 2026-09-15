import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-opciones',
    templateUrl: './opciones.component.html',
    styleUrls: ['./opciones.component.css'],
    standalone: false
})
export class OpcionesComponent implements OnInit {

  @Input() filterSelected: string;

  constructor() { }

  ngOnInit(): void {
  }

}
