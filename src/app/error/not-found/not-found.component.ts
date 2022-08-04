import { Component, OnInit } from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  options: AnimationOptions = {
    path: './assets/animations/error404.json', // download the JSON version of animation in your project directory and add the path to it like ./assets/animations/example.json
  };

  constructor() { }

  ngOnInit(): void {
  }

}
