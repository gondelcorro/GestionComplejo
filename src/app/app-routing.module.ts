import { ReservaComponent } from './pages/reserva/reserva.component';
import { PagoComponent } from './pages/pago/pago.component';
import { CanchaComponent } from './pages/cancha/cancha.component';
import { GuardGuard } from './service/guard.guard';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], //El use # lo agrego como estrategia en las URL
  exports: [RouterModule]
})
export class AppRoutingModule { }
