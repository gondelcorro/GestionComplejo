import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  images = [
    { path: 'assets/images/carousel/estadio1.jpg' },
    { path: 'assets/images/carousel/estadio2.jpg' }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
