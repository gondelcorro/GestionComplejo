import { LoginService } from './login.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) { 

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    let estaLogeado = this.loginService.isLoggedIn();
    let tokenExpirado = this.loginService.isTokenExpired();
    console.log("LOGUADO: " + estaLogeado);
    console.log("EXPIRADO: " + tokenExpirado);
    if(estaLogeado && !tokenExpirado){
      return true;
    }else{
      this.loginService.logout();
      return false;
    }
  }
  
}
