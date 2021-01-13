import { ComplejoSharedService } from './../../service/complejo-shared.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CanchaService } from 'src/app/service/cancha.service';
import { Cancha } from 'src/app/model/cancha';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  formCtrlCancha = new FormControl();
  formCtrlFecha = new FormControl();
  public canchas: Cancha[];
  public selectedCancha: Cancha;
  public selectedFecha: Date;
  public minDate: Date;
  public maxDate: Date;

  constructor(private _formBuilder: FormBuilder, private canchaService: CanchaService, private complejoSharedService: ComplejoSharedService) {
    this.minDate = new Date(); //Fecha actual
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 7);
   }

  ngOnInit(): void {
    this.listarCanchas();
    this.firstFormGroup = this._formBuilder.group({
      formCtrlCancha: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      formCtrlFecha: ['', Validators.required]
    });
  }

  listarCanchas() {
    let idComplejo = this.complejoSharedService.getComplejo().idComplejo;
    this.canchaService.listarPorComplejo(idComplejo).subscribe(data => {
      this.canchas = data;
    });
  }

}
