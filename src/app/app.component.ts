import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as decode from 'jwt-decode';
import {Subject} from 'rxjs';
import {LoaderService} from './shared/loader.service';
import {ComplejoService} from './service/complejo.service';
import {ComplejoSharedService} from './service/complejo-shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public isLoading: Subject<boolean> = this.loader.isLoading;

  constructor(private _router: Router, public _activeRoute: ActivatedRoute, private loader: LoaderService) {

  }

  ngOnInit() {
    this._activeRoute.queryParams.subscribe(queryParams => {
      if (queryParams.token != null) { //El parametro q viene del login en la url se llama token
        let token = queryParams.token;
        console.log("TOKEN AS STRING: " + token)
        let payload = token.split('.')[1];
        let jsonToken = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        console.log("TOKEN AS JSON:", jsonToken);
        sessionStorage.setItem(environment.token, token); //Guardo el token
        sessionStorage.setItem(environment.user, jsonToken.user_name); //Guardo el user
        this._router.navigate(['/main-layout/dashboard']);// Fuerzo a q se actualice la navegacion para borrar el token de la url
      }
    });
  }
}
