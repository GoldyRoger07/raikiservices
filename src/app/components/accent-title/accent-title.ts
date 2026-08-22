import { Component, input } from '@angular/core';

@Component({
  selector: 'my-accent-title',
  imports: [],
  templateUrl: './accent-title.html',
  styleUrl: './accent-title.css',
})
export class AccentTitle {
  textColor = input<string>('text-primary')
}
