import { Complejo } from './../model/complejo';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComplejoSharedService {

  complejo: Complejo;

  constructor() {
    this.complejo = new Complejo();
   }

  public getComplejo() : Complejo{
    return this.complejo;
  }

  public setComplejo(complejo: Complejo) : void{
    this.complejo = complejo;
  }
}
