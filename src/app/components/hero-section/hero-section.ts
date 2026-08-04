import { Component } from '@angular/core';
import { NgxAuroraComponent } from '@omnedia/ngx-aurora';

@Component({
  selector: 'my-hero-section',
  imports: [NgxAuroraComponent],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {

  title = "Parlons de votre projet"
  desc = "Vous avez une idée, un projet ou souhaitez améliorer votre présence en ligne ? Notre équipe est à votre écoute pour vous accompagner. Contactez-nous dès aujourd'hui et obtenez une réponse rapide ainsi qu'un devis personnalisé."
}
