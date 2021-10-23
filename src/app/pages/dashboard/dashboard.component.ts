import {Component, OnInit} from '@angular/core';
import {ReservaService} from '../../service/reserva.service';
import {ComplejoSharedService} from '../../service/complejo-shared.service';
import {EstadoReserva} from '../../model/estadoReserva';
import {DatePipe} from '@angular/common';
import {ComplejoService} from '../../service/complejo.service';
import {environment} from '../../../environments/environment';
import {Complejo} from '../../model/complejo';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  images = [
    {path: 'assets/images/carousel/autogestion.jpg'},
    {path: 'assets/images/carousel/automoviles.jpg'},
    {path: 'assets/images/carousel/bicicleta.jpg'}
  ];
  private complejo: Complejo;
  public imagenComplejo: any;
  public cantReservasConf = 0;
  public cantReservasFin = 0;
  public cantReservasAnu = 0;

  constructor(private reservaService: ReservaService, private complejoSharedService: ComplejoSharedService,
              private datePipe: DatePipe, private complejoService: ComplejoService, private sanitization: DomSanitizer) {
  }

  ngOnInit(): void {
    this.cargarData();
  }

  private async cargarData(){
    this.complejo = await this.complejoService.obtenerComplejo(sessionStorage.getItem(environment.user)).toPromise();
    const fecha = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    this.reservaService.listarPorComplejoYFecha(this.complejo, fecha).subscribe(reservas => {
      this.complejoSharedService.setComplejo(this.complejo);
      this.cantReservasConf = reservas.filter(reserva => reserva.estado == EstadoReserva.CONFIRMADA).length;
      this.cantReservasFin = reservas.filter(reserva => reserva.estado == EstadoReserva.FINALIZADA).length;
      this.cantReservasAnu = reservas.filter(reserva => reserva.estado == EstadoReserva.ANULADA).length;
    });
    this.mostrarImagen();
  }

  // 1 obtiene imagen, sino obtiene logo
  mostrarImagen() {
    this.complejoService.leerArchivo(this.complejo.idComplejo, 1).subscribe(data => {
      this.imagenComplejo = data;
      this.convertir(data);
    });
  }

  convertir(data: any) {
    var reader = new FileReader(); //transforma la data en un archivo de lectura de js
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      this.imagenComplejo = this.sanitization.bypassSecurityTrustResourceUrl(reader.result as string);  //proteje la url para que puede ser accesible y leida por angular
    }
  }

}
