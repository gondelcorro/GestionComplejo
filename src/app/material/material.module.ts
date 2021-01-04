import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatCardModule,
    MatMenuModule
  ],
    //AGREGAR EL EXPORTS TB PARA LOS COMP DE ANG MAT SI O SI
    //NO OLVIDAR REGISTRAR ESTE MODULO EN EL APPMODULE
    exports: [
      MatTableModule,
      MatToolbarModule,
      MatIconModule,
      MatSidenavModule,
      MatDividerModule,
      MatListModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatSortModule,
      MatSnackBarModule,
      MatDialogModule,
      MatCheckboxModule,
      MatExpansionModule,
      MatSelectModule,
      MatStepperModule,
      MatAutocompleteModule,
      MatCardModule,
      MatMenuModule
    ],
})
export class MaterialModule { }
