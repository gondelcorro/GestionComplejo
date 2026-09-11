import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {throwError as observableThrowError, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpSentEvent,
  HttpHeaderResponse,
  HttpProgressEvent,
  HttpResponse,
  HttpUserEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import {LoginService} from './login.service';
import {LoaderService} from './loader.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private _router: Router, private loginService: LoginService,
              private loaderService: LoaderService) {

  }

  private _addHeaders(req: HttpRequest<any>): HttpRequest<any> {
    if (req.url.includes('token')) {
      return req;
    }
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.loginService.getToken()}`/*,
        'Content-Type': 'application/json'*/ // OJO CON SETEAR ESTE HEADER. EL NAV X DEFECTO SEGUN EL REQUEST LOS COLOCA
        //PERO SI DEFINO AQUI UNO ESPECIFICO PUEDE TRAER PROBLEMAS POR EJ CUANDO ENVIO IMG (FORM DATA) EL CONTENT-TYPE EN ESE CASO ES MULTI-PART/FORM-DATA
      }
    });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    this.loaderService.show();
    return next.handle(this._addHeaders(request))
      .pipe(map(event => {
        if (event instanceof HttpResponse) {
          setTimeout(()=>{
            this.loaderService.hide();
            }, 5);
        }
        return event;
      }))
      .pipe(catchError(err => {
          if (err instanceof HttpErrorResponse) {
            this.loaderService.hide();
            switch ((<HttpErrorResponse> err).status) {
              case 404:
                return this.handle404Error(err);
              case 401:
                return this.handle401Error(request, next, err);
              case 500:
                return this.handle500Error(err);
              default:
                return this.handle500Error(err);
            }
          } else {
            return observableThrowError(err);
          }
        })
      );
  }

  handle404Error(error) {
    this._router.navigate(['/not-found']);
    return observableThrowError(error);
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler, error) {
    if (!this.loginService.isLoggedIn() || this.loginService.isTokenExpired()) {
      this.loginService.logout();
    }
    return observableThrowError(error);
  }

  handle500Error(error) {
    this._router.navigate(['/error-server']);
    return observableThrowError(error);
  }
}
