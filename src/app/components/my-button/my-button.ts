import { Component, input } from '@angular/core';

@Component({
  selector: 'my-button',
  imports: [],
  templateUrl: './my-button.html',
  styleUrl: './my-button.css',
})
export class MyButton {

  fluid = input(false)
}
