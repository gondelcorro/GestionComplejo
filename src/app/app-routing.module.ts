import { ReservaComponent } from './pages/reserva/reserva.component';
import { PagoComponent } from './pages/pago/pago.component';
import { CanchaComponent } from './pages/cancha/cancha.component';
import { GuardGuard } from './shared/guard.guard';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ErrorServerComponent} from './error/error-server/error-server.component';
import {NotFoundComponent} from './error/not-found/not-found.component';
import {ConfiguracionComponent} from './pages/configuracion/configuracion.component';
import {BalanceComponent} from './pages/balance/balance.component';
import {BalanceDiarioComponent} from './pages/balance/opciones/balance-diario/balance-diario.component';
import {BalanceSemanalComponent} from './pages/balance/opciones/balance-semanal/balance-semanal.component';
import {BalanceMensualComponent} from './pages/balance/opciones/balance-mensual/balance-mensual.component';
import {TurnoFijoComponent} from './pages/turno-fijo/turno-fijo.component';

const routes: Routes = [
  //Cuando la ruta sea http://localhost:4500/# (definida en el login) q pase por el app-root para q tome de la url el token
  { path: '', redirectTo: 'app-root', pathMatch: 'full' },
  {
    path: 'main-layout', component: MainLayoutComponent, canActivate: [GuardGuard], children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'cancha', component: CanchaComponent
      },
      {
        path: 'pago', component: PagoComponent
      },
      {
        path: 'reserva', component: ReservaComponent
      },
      {
        path: 'turno-fijo', component: TurnoFijoComponent
      },
      {
        path: 'configuracion', component: ConfiguracionComponent
      },
      {
        path: 'balance', component: BalanceComponent, children: [
          {
            path: 'balance-diario', component: BalanceDiarioComponent
          },
          {
            path: 'balance-semanal', component: BalanceSemanalComponent
          },
          {
            path: 'balance-mensual', component: BalanceMensualComponent
          }
        ]
      },
    ]
  },
  {
    path: 'error-server', component: ErrorServerComponent
  },
  {
    path: 'not-found', component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], //El use # lo agrego como estrategia en las URL
  exports: [RouterModule]
})
export class AppRoutingModule { }
