import {Component} from '@angular/core';

@Component({
  selector: 'n9-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss'
  ]
})
export class AppComponent {

  attributes = [
    'width', 'height', 'depth'
  ];

  values = [
    'width'
  ];

}
