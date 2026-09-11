import { ComplejoSharedService } from './../../service/complejo-shared.service';
import { Complejo } from './../../model/complejo';
import { ComplejoService } from './../../service/complejo.service';
import { LoginService } from '../../shared/login.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {CambioClaveComponent} from '../configuracion/cambio-clave/cambio-clave.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  public correoComplejo: string = sessionStorage.getItem(environment.user);
  complejo: Complejo = new Complejo();
  imagenLogo : any;

  constructor(public route : ActivatedRoute, private loginService: LoginService, private complejoService: ComplejoService,
     private complejoShared: ComplejoSharedService, private sanitization: DomSanitizer, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.cargarComplejo();

  }

  async cargarComplejo(){
    this.complejo = await this.complejoService.obtenerComplejo(this.correoComplejo).toPromise();
    this.complejoShared.setComplejo(this.complejo);
    this.complejoService.complejoCambio.next(this.complejo);
    console.log(this.complejo);
    this.mostrarImagen();
  }

  cambiarClave(){
    this.dialog.open(CambioClaveComponent, {
      width: '350px'
    });
  }

  cerrarSesion(){
    this.loginService.logout();
  }

  // 1 obtiene imagen, sino obtiene logo
  mostrarImagen() {
    this.complejoService.leerArchivo(this.complejo.idComplejo, 0).subscribe(data => {
      this.imagenLogo = data;
      let x = this.convertir(data);
    });
  }

  convertir(data: any) {
    var reader = new FileReader(); //transforma la data en un archivo de lectura de js
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      this.imagenLogo = this.sanitization.bypassSecurityTrustResourceUrl(reader.result as string);  //proteje la url para que puede ser accesible y leida por angular
    }
  }

}
