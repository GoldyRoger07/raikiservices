import { Component, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { NgxParticlesComponent } from "@omnedia/ngx-particles";
import { MyButton } from "../my-button/my-button";

@Component({
  selector: 'my-cta-section',
  imports: [NgxParticlesComponent, MyButton, NgTemplateOutlet],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.css',
})
export class CtaSection {
  // Les particules (canvas) ne sont rendues qu'au navigateur : leur
  // ngAfterViewInit appelle getBoundingClientRect(), indisponible au prerender.
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
}
