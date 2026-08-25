import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'my-slider',
  imports: [],
  templateUrl: './my-slider.html',
  styleUrl: './my-slider.css',
})
export class MySlider {
  // On reçoit le template unique qui contient déjà la boucle
  @Input() templateContenu!: TemplateRef<any>;
}
