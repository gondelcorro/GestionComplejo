import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  images = [
    { path: 'assets/images/carousel/autogestion.jpg' },
    { path: 'assets/images/carousel/automoviles.jpg' },
    { path: 'assets/images/carousel/bicicleta.jpg' }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
