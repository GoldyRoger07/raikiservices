import { Component } from '@angular/core';
import { Header } from "../../../components/header/header";
import { Footer } from "../../../components/footer/footer";
import { HeroSection } from "../../../components/hero-section/hero-section";
import { Container } from "../../../components/container/container";
import { CardData } from '../../../models/card-data.model';
import { SeparatorDesign } from "../../../components/separator-design/separator-design";
import { CtaSection } from "../../../components/cta-section/cta-section";

@Component({
  selector: 'app-websites',
  imports: [Header, Footer, HeroSection, Container, SeparatorDesign, CtaSection],
  templateUrl: './websites.html',
  styleUrl: './websites.css',
})
export default class Websites {



  serviceCards: CardData[] = [
    {
      title: "Sites vitrines",
      desc: "Des sites internet complets qui mettent en valeur vos services, votre équipe, votre adresse et vos contacts. Le pilier essentiel de votre présence en ligne.",
      cover: "pi pi-briefcase text-gray-500"
    },
    {
      title: "Boutiques en ligne",
      desc: "Vendez vos produits en ligne grâce à l’intégration de WooCommerce ou Shopify. Gestion des paiements, des stocks et des livraisons intégrée.",
      cover: "pi pi-shopping-cart text-green-500"
    },
    {
      title: "Landing Pages",
      desc: "Des pages d’atterrissage à fort taux de conversion, conçues pour vos campagnes publicitaires, vos promotions ou vos lancements de produits. Objectif : transformer vos clics en clients.",
      cover: "pi pi-bullseye text-yellow-500"
    },
    {
      title: "Refonte de sites internet",
      desc: "Votre site actuel semble daté ou manque de rapidité ? Nous le repensons intégralement à partir de zéro, tout en préservant votre référencement SEO.",
      cover: "pi pi-sync text-violet-500"
    },
    {
      title: "Sites portfolio",
      desc: "Mettez en valeur votre travail grâce à un portfolio visuellement saisissant. Idéal pour les créatifs, les photographes, les freelances et les agences.",
      cover: "pi pi-id-card  text-pink-500"
    },
    {
      title: "Sites de réservation et prise de rendez-vous",
      desc: " Permettez à vos clients de réserver directement depuis votre site internet. Idéal pour les salons, les cliniques, les consultants et toutes les activités de services.",
      cover: "pi pi-calendar-times text-blue-500"
    }



  ]


  getIconColor(id: number){
    let result = ""
    switch(id){
      case 1:
        result = "bg-gray-100"
      break
      case 2:
        result = "bg-green-100"
      break
      case 3:
        result = "bg-yellow-100"
      break
      case 4:
        result = "bg-violet-100"
      break
      case 5:
        result = "bg-pink-100"
      break
      case 6:
        result = "bg-blue-100"
      break
    }

    return result
  }
  
}
