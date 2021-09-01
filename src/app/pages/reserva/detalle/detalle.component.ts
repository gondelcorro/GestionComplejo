import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ReservaService} from '../../../service/reserva.service';
import {Reserva} from '../../../model/reserva';
import {AnulacionComponent} from '../anulacion/anulacion.component';
import {EstadoReserva} from '../../../model/estadoReserva';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DatePipe} from '@angular/common';
import {NuevaComponent} from '../nueva/nueva.component';
import {PagoService} from '../../../service/pago.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  public codigoReserva: string;
  public reserva: Reserva;
  reservaAnulada = EstadoReserva.ANULADA;
  reservaConfirmada = EstadoReserva.CONFIRMADA;
  reservaFinalizada = EstadoReserva.FINALIZADA;
  public esReservaPasada = false;
  public fechaReservaIni: Date;
  public tieneReintegro = false;

  constructor(@Inject(MAT_DIALOG_DATA) private eventSelect, private reservaService: ReservaService, private datePipe: DatePipe,
              private dialogRegDetalle: MatDialogRef<DetalleComponent>, private dialog: MatDialog, private snackbar: MatSnackBar,
              private pagoService: PagoService) {
    this.codigoReserva = eventSelect;
  }

  ngOnInit(): void {
    this.reservaService.obtenerPorCodigo(this.codigoReserva).subscribe(reserva => {
      this.reserva = reserva;
      let dia = Number(reserva.fecha.substring(0,2));
      let mes = Number(reserva.fecha.substring(3,5));
      let anio = Number(reserva.fecha.substring(6,10));
      let horaFin = Number(reserva.horaFin.substring(0,2));
      let minutosFin = Number(reserva.horaFin.substring(3,5));
      let reservaAsDate : Date = new Date(anio, mes-1, dia, horaFin, minutosFin);
      this.esReservaPasada = reservaAsDate < new Date(); //PARA SETEA EL COMPORTAMIENTO DE LOS BOTONES

      let horaInicio = Number(reserva.horaInicio.substring(0,2));
      let minutosInicio = Number(reserva.horaInicio.substring(3,5));
      this.fechaReservaIni = new Date(anio, mes-1, dia, horaInicio, minutosInicio) // PARA PASARLE LA INFO A NUEVA RESERVA
      this.pagoService.obtenerPorReserva(reserva.codigo).subscribe(pagos =>{
        this.tieneReintegro = pagos.some(pago => pago.reintegro);
      });
    });
  }

  anularReserva() {
    if (this.reserva.estado == EstadoReserva.CONFIRMADA) {
      this.reservaService.validarReglasReservaEdiAnu(this.reserva).subscribe(resp => {
        if (resp.codigo == 99) {
          this.dialog.closeAll(); //cierro el modal de detalle y me voy a la anulacion
          this.dialog.open(AnulacionComponent, {
            data: this.reserva,
            disableClose: true,
            width: '500px'
          });
        } else {
          this.snackbar.open(resp.descripcion, 'Aviso', {duration: 5000});
        }
      });
    }
  }

  nuevaReserva() {
    this.dialog.closeAll(); //cierro el modal de detalle y me voy a la anulacion
    this.dialog.open(NuevaComponent, {
      data: {
        fechaReserva: this.fechaReservaIni,
        complejo: this.reserva.complejo,
        cancha: this.reserva.cancha
      },
      disableClose: true,
      width: '380px'
    });
  }

  reintegrar() {
    this.dialog.closeAll();
      this.pagoService.registrarReintegro(this.reserva).subscribe( registro => {
        if(registro == 1){
          this.snackbar.open("Se registró el reintegro correctamente", 'Aviso', {duration: 5000});
        }else{
          this.snackbar.open("Error registrando el reintegro", 'Error', {duration: 5000});
        }
      });
  }

}
