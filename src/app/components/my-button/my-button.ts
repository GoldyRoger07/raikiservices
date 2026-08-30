import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'my-button',
  imports: [],
  templateUrl: './my-button.html',
  styleUrl: './my-button.css',
})
export class MyButton {

  fluid = input(false)

  @Input() bgColor: string = 'bg-primary';
  @Input() textColor: string = 'text-white';

  get myClasses(): string{
    return `rounded-full p-3 flex items-center gap-3  mx-auto md:mx-0 ${this.bgColor} ${this.textColor}`;
  }
}
