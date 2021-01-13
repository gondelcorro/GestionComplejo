import { ComplejoSharedService } from './service/complejo-shared.service';
import { MaterialModule } from './material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

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
import { SchedulerComponent } from './pages/reserva/scheduler/scheduler.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { SchedulerModule } from 'angular-calendar-scheduler';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    DashboardComponent,
    CanchaComponent,
    EdicionComponent,
    PagoComponent,
    ReservaComponent,
    SchedulerComponent
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
    ReactiveFormsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }), // ng add angular-calendar
    SchedulerModule.forRoot({ locale: 'es', headerDateFormat: 'daysRange' }) //npm install angular-calendar-scheduler date-fns --save and npm install moment
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-AR'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
