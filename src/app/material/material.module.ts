import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatSortModule} from '@angular/material/sort';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatStepperModule} from '@angular/material/stepper';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatLegacyRadioModule as MatRadioModule} from '@angular/material/legacy-radio';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';

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
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatBottomSheetModule,
    MatPaginatorModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatRadioModule,
    MatTooltipModule
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
      MatMenuModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatProgressSpinnerModule,
      MatProgressBarModule,
      MatBottomSheetModule,
      MatPaginatorModule,
      MatChipsModule,
      MatButtonToggleModule,
      MatTabsModule,
      MatRadioModule,
      MatTooltipModule
    ]
})
export class MaterialModule { }
