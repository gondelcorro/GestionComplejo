import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {

  constructor(private loginService: LoginService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const estaLogeado = this.loginService.isLoggedIn();
    const tokenExpirado = this.loginService.isTokenExpired();

    console.log('LOGUEADO: ' + estaLogeado);
    console.log('EXPIRADO: ' + tokenExpirado);

    if (estaLogeado && !tokenExpirado) {
      return true;
    } else {
      this.loginService.logout();
      return false;
    }
  }
}
