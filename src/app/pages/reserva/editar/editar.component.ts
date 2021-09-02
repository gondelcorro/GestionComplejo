import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Reserva} from '../../../model/reserva';
import {Cancha} from '../../../model/cancha';
import {Complejo} from '../../../model/complejo';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DatePipe} from '@angular/common';
import {ReservaService} from '../../../service/reserva.service';
import {CanchaService} from '../../../service/cancha.service';

@Component({
  selector: 'app-edicion',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  public selectedComplejo: Complejo;
  public canchas: Cancha[];
  public selectedCancha: Cancha;
  public selectedFecha: Date;
  public minDate: Date;
  public maxDate: Date;
  public mostrarScheduler = false;
  public reservas: Reserva[];
  public formGroup: FormGroup;
  public formCtrlCancha: FormControl;
  public formCtrlFecha: FormControl;
  textoEdicion = "En la edición de reserva podrás cambiar de cancha, fecha y horario pero el complejo deberá ser el mismo que seleccionaste en tu reserva" +
    " original, al igual que el tiempo del turno y el importe que abonaste."

  constructor(public dialogRef: MatDialogRef<EditarComponent>,
              @Inject(MAT_DIALOG_DATA) public reservaSelect: Reserva, private canchaService: CanchaService,
              private reservaService: ReservaService, private datePipe: DatePipe) {
    this.selectedComplejo = reservaSelect.complejo;
    this.minDate = new Date(); //Fecha actual
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.formGroup = new FormGroup({
      'cancha': new FormControl('', [Validators.required]),
      'fecha': new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.cargarCancha();
  }

  public async cargarCancha(){
    this.canchas = await this.canchaService.listarPorComplejoYHabilitada(this.selectedComplejo.idComplejo).toPromise();
  }

  cancelar(){
    this.dialogRef.close();
  }

  public setMostrarScheduler(){
    this.reservaService.canchaCambio.next(this.selectedCancha);
    this.reservaService.fechaCambio.next(this.selectedFecha);
    this.mostrarScheduler = true;
  }

}
