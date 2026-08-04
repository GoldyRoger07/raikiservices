import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { themeConfig } from './config/brand/theme';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('raikiservices-ssr');
  
  constructor(theme: ThemeService){
    theme.init(themeConfig)
  }
}
