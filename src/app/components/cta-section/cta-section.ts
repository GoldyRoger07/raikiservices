import { Component } from '@angular/core';
import { NgxParticlesComponent } from "@omnedia/ngx-particles";
import { MyButton } from "../my-button/my-button";

@Component({
  selector: 'my-cta-section',
  imports: [NgxParticlesComponent, MyButton],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.css',
})
export class CtaSection {}
