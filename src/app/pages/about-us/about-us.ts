import { Component, HostListener, signal } from '@angular/core';
import { Header } from "../../components/header/header";
import { HeroSection } from "../../components/hero-section/hero-section";
import { Footer } from "../../components/footer/footer";
import { SeparatorDesign } from "../../components/separator-design/separator-design";
import { Container } from "../../components/container/container";
import { CardData } from '../../models/card-data.model';
 import { NgxTimelineComponent, NgxTimelineEntryComponent } from '@omnedia/ngx-timeline';

@Component({
  selector: 'app-about-us',
  imports: [Header, HeroSection, Footer, SeparatorDesign, Container, NgxTimelineComponent, NgxTimelineEntryComponent],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export default class AboutUs {

  // Stocke la position de la souris
  coords = signal({ x: 0, y: 0 });
  
  // Contrôle la visibilité du suiveur
  isHovered = signal(false);

  differenceCards: CardData[] = [
    {
      title: 'Sur mesure',
      desc: 'Pas de modèle générique. Chaque site est conçu autour de votre entreprise et de vos objectifs.'
    },
    {
      title: 'Pensé pour vos clients',
      desc: 'Nous concevons des expériences simples à comprendre et agréables à utiliser.'
    },
    {
      title: 'Construit pour durer',
      desc: 'Un site propre, performant et évolutif, capable d\'accompagner votre entreprise.'
    },
    {
      title: 'Un accompagnement réel',
      desc: 'Nous ne disparaissons pas après la mise en ligne. Nous pouvons vous accompagner dans l\'hébergement, la maintenance et l\'évolution de votre site.'
    },
  ]

  processCards: CardData[] = [
    {
      title: 'Échange',
      desc: 'Nous comprenons votre entreprise et vos objectifs.'
    },
    {
      title: 'Conception',
      desc: 'Nous définissons la structure, le contenu et l\'identité visuelle.'
    },
    {
      title: 'Développement',
      desc: 'Nous transformons le concept en un site rapide et responsive.'
    },
    {
      title: 'Mise en ligne',
      desc: 'Votre site est testé, optimisé et déployé'
    },
    {
      title: 'Évolution',
      desc: 'Nous restons disponibles pour la maintenance et les améliorations.'
    },
  ]

  

  // Gère le mouvement de la souris dans la carte
  onMouseMove(event: MouseEvent) {
    // offsetX et offsetY donnent la position par rapport aux bords de la carte
   
    console.log(event.offsetX)
   
    this.coords.set({
      x: event.offsetX,
      y: event.offsetY
    });
  }

}
