import {MaterialModule} from './material/material.module';
import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MainLayoutComponent} from './pages/main-layout/main-layout.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AvatarModule} from 'ngx-avatar';
import {FlipModule} from 'ngx-flip';
import {CanchaComponent} from './pages/cancha/cancha.component';
import {EdicionComponent} from './pages/cancha/edicion/edicion.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PagoComponent} from './pages/pago/pago.component';
import {ReservaComponent} from './pages/reserva/reserva.component';
import {SchedulerComponent} from './pages/reserva/scheduler/scheduler.component';
import {CalendarModule, DateAdapter} from 'angular-calendar';
import {SchedulerModule} from 'angular-calendar-scheduler';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';

import {CommonModule, DatePipe, registerLocaleData} from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import {DetalleReservaComponent} from './pages/pago/detalle-reserva/detalle-reserva.component';
import {LottieModule} from 'ngx-lottie';
import {NotFoundComponent} from './error/not-found/not-found.component';
import {ErrorServerComponent} from './error/error-server/error-server.component';

registerLocaleData(localeEsAr, 'es-Ar');
import {TokenInterceptor} from './shared/token-interceptor.interceptor';
import player from 'lottie-web';
import {DetalleComponent} from './pages/reserva/detalle/detalle.component';
import {NuevaComponent} from './pages/reserva/nueva/nueva.component';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import {ProcesandoReservaComponent} from './pages/reserva/procesando-reserva/procesando-reserva.component';
import {ConfiguracionComponent} from './pages/configuracion/configuracion.component';
import {DiasAtencionComponent} from './pages/configuracion/dias-atencion/dias-atencion.component';
import {BalanceComponent} from './pages/balance/balance.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ImagenComponent} from './pages/configuracion/imagen/imagen.component';
import {OpcionesComponent} from './pages/balance/opciones/opciones.component';
import {BalanceDiarioComponent} from './pages/balance/opciones/balance-diario/balance-diario.component';
import {BalanceSemanalComponent} from './pages/balance/opciones/balance-semanal/balance-semanal.component';
import {BalanceMensualComponent} from './pages/balance/opciones/balance-mensual/balance-mensual.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {CambioClaveComponent} from './pages/configuracion/cambio-clave/cambio-clave.component';
import {AnulacionComponent} from './pages/reserva/anulacion/anulacion.component';
import {DeshabilitarComponent} from './pages/cancha/deshabilitar/deshabilitar.component';
import {ConfirmaCambiosComponent} from './pages/configuracion/confirma-cambios/confirma-cambios.component';
import {EditarComponent} from './pages/reserva/editar/editar.component';
import {SchedulerEdicionComponent} from './pages/reserva/editar/scheduler-edicion/scheduler-edicion.component';
import {NuevoTurnoComponent} from './pages/turno-fijo/nuevo-turno/nuevo-turno.component';
import {ReservasTurnoComponent} from './pages/turno-fijo/reservas-turno/reservas-turno.component';
import {TurnoLibreComponent} from './pages/pago/turno-libre/turno-libre.component';
import {PagoTurnoFijoComponent} from './pages/pago/turno-fijo/turno-fijo.component';
import {TurnoFijoComponent} from './pages/turno-fijo/turno-fijo.component';
import { AbonarFechaComponent } from './pages/turno-fijo/reservas-turno/abonar-fecha/abonar-fecha.component';
import { CancelarFechaComponent } from './pages/turno-fijo/reservas-turno/cancelar-fecha/cancelar-fecha.component';
import { FileInputComponent } from './file-input/file-input.component';

// add this lines for lotties
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    DashboardComponent,
    CanchaComponent,
    EdicionComponent,
    PagoComponent,
    ReservaComponent,
    SchedulerComponent,
    DetalleReservaComponent,
    NotFoundComponent,
    ErrorServerComponent,
    DetalleComponent,
    NuevaComponent,
    ProcesandoReservaComponent,
    ConfiguracionComponent,
    DiasAtencionComponent,
    BalanceComponent,
    ImagenComponent,
    OpcionesComponent,
    BalanceDiarioComponent,
    BalanceSemanalComponent,
    BalanceMensualComponent,
    CambioClaveComponent,
    AnulacionComponent,
    DeshabilitarComponent,
    ConfirmaCambiosComponent,
    EditarComponent,
    SchedulerEdicionComponent,
    TurnoFijoComponent,
    NuevoTurnoComponent,
    ReservasTurnoComponent,
    TurnoLibreComponent,
    PagoTurnoFijoComponent,
    AbonarFechaComponent,
    CancelarFechaComponent,
    FileInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    CommonModule,
    AvatarModule, //npm install ngx-avatar --save
    FlipModule, // npm install ngx-flip --save
    FormsModule, // NECESARIO IMPORTAR PARA USAR EL NgModule
    ReactiveFormsModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}), // ng add angular-calendar
    SchedulerModule.forRoot({locale: 'es', headerDateFormat: 'daysRange'}), //npm install angular-calendar-scheduler date-fns --save and npm install moment
    LottieModule.forRoot({player: playerFactory}), // npm i lottie-web ngx-lottie
    NgxMatTimepickerModule.setLocale('es-Ar'), //npm i --save ngx-mat-timepicker (USADO PARA EL RELOJ MODAL)
    NgxMaterialTimepickerModule, //npm install --save ngx-material-timepicker (USADO PARA LA HORA TIPO INPUT)
    MatDatepickerModule,
    MatMomentDateModule //npm i @angular/material-moment-adapter
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-AR'
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
