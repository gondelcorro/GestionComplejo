import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {ComplejoService} from '../../../service/complejo.service';

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.css']
})
export class ImagenComponent implements OnInit {

  imagenData: any; //la img es de cualq tipo xq viene un stream de datos

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private complejoService: ComplejoService,
                  private sanitization: DomSanitizer) { }

  ngOnInit(): void {
    if(this.data.complejoSelect != null){
      this.mostrarImagen();
    }
  }

  mostrarImagen() {
    this.complejoService.leerArchivo(this.data.complejoSelect.idComplejo, this.data.imgOrlogo).subscribe(data => {
      this.imagenData = data;
      let x = this.convertir(data);
    });
  }

  convertir(data: any) {
    var reader = new FileReader(); //transforma la data en un archivo de lectura de js
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(reader.result as string);  //proteje la url para que puede ser accesible y leida por angular
    }
  }

}
