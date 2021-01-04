import { ComplejoSharedService } from './service/complejo-shared.service';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AvatarModule } from 'ngx-avatar';
import { FlipModule } from 'ngx-flip';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { CanchaComponent } from './pages/cancha/cancha.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EdicionComponent } from './pages/cancha/edicion/edicion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagoComponent } from './pages/pago/pago.component';
import { ReservaComponent } from './pages/reserva/reserva.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    DashboardComponent,
    CanchaComponent,
    EdicionComponent,
    PagoComponent,
    ReservaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AvatarModule, //npm install ngx-avatar --save
    FlipModule, // npm install ngx-flip --save
    IvyCarouselModule, //npm i angular-responsive-carousel
    FlexLayoutModule, //npm i  @angular/flex-layout (reiniciar)
    FormsModule, // NECESARIO IMPORTAR PARA USAR EL NgModule
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
