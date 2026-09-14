import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {ComplejoService} from '../../../service/complejo.service';
import {environment} from '../../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.css']
})
export class CambioClaveComponent implements OnInit {

  public formGorup: UntypedFormGroup;
  public hidePass = true;
  public hidePassConfirm = true;

  constructor(private dialogRef: MatDialogRef<CambioClaveComponent>, private complejoService: ComplejoService,
              private snackbar: MatSnackBar) {

    this.formGorup = new UntypedFormGroup({
      claveActual: new UntypedFormControl(),
      clave: new UntypedFormControl('', [Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*[0-9]).{10,}$")]),
      confirmaClave: new UntypedFormControl()
    });
    this.formGorup.controls['confirmaClave'].setValidators([Validators.required, this.coincidenClaves.bind(this)]);
  }

  ngOnInit(): void {
  }

  coincidenClaves(control: UntypedFormControl): { [s: string]: boolean } {
    return control.value != this.formGorup.controls['clave'].value ? { coinciden: false } : null
  }

  cambiarClave(){
    if (this.formGorup.valid) {
      let usuario = sessionStorage.getItem(environment.user);
      let clave = this.formGorup.controls['claveActual'].value;
      this.complejoService.autenticarUsuario(usuario, clave).subscribe(autenticado =>{
        if(!autenticado){
          this.snackbar.open('Su clave actual es incorrecta', 'Error',{
            duration: 5000
          })
        }else{
          let clave = this.formGorup.get('clave').value;
          this.complejoService.cambiarClave(usuario, clave).subscribe(resp =>{
            if(resp){
              this.snackbar.open('Se modificó su clave exitosamente', 'Info',{
                duration: 5000
              })
            }
            this.dialogRef.close();
          });
        }
      });
    }
  }

}
