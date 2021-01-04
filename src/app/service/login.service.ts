import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt'; //npm install @auth0/angular-jwt

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    // O lo instancio manualmente o lo uso como injeccion en el constructor y lo agrego en el AppModule como JwtModule
    private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private router: Router) { }

  logout(){
    sessionStorage.clear();
    document.location.href = environment.url_login;
    //this.router.navigate(['main-layout']);
    //console.log("LOGOUT!!!!!!");
  }

  isLoggedIn(){
    let token = sessionStorage.getItem(environment.token);
    return token!=null;
  }

  public isTokenExpired(): boolean {
    const token = sessionStorage.getItem(environment.token);
    return this.jwtHelper.isTokenExpired(token); 
  }
}
