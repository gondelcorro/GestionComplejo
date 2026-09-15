import { Component, OnInit } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';

@Component({
    selector: 'app-error-server',
    templateUrl: './error-server.component.html',
    styleUrls: ['./error-server.component.css'],
    standalone: false
})
export class ErrorServerComponent implements OnInit {

  options: AnimationOptions = {
    path: './assets/animations/error500.json', // download the JSON version of animation in your project directory and add the path to it like ./assets/animations/example.json
  };

  constructor() { }

  ngOnInit(): void {
  }

}
