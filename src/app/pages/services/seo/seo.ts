import { Component } from '@angular/core';
import { Header } from "../../../components/header/header";
import { HeroSection } from "../../../components/hero-section/hero-section";
import { Footer } from "../../../components/footer/footer";
import { CtaSection } from "../../../components/cta-section/cta-section";
import { Container } from "../../../components/container/container";
import { CardData } from '../../../models/card-data.model';
import { SeparatorDesign } from "../../../components/separator-design/separator-design";

@Component({
  selector: 'app-seo',
  imports: [Header, HeroSection, Footer, CtaSection, Container, SeparatorDesign],
  templateUrl: './seo.html',
  styleUrl: './seo.css',
})
export default class Seo {

  serviceCards: CardData[] = [
    {
  title: 'Positionnement Google',
  desc: 'Nous optimisons la structure, le contenu, la vitesse et les backlinks de votre site afin que Google vous place au plus haut sur les mots-clés que vos clients recherchent réellement.',
  cover: 'pi pi-chart-line text-gray-500',
  list: [
    "Recherche et stratégie de mots-clés",
    "Optimisation on-page",
    "Audits SEO techniques",
    "Recommandations de contenu"
  ]
},
   {
  title: 'SEO Local',
  desc: 'Propulsez votre entreprise sur Google Maps, dans le pack local de Google et sur les annuaires locaux. Nous créons et gérons votre fiche Google Business Profile pour que vos clients vous trouvent en premier.',
  cover: 'pi pi-map-marker text-green-500',
  list: [
    "Configuration de la fiche Google Business Profile",
    "Inscription sur les annuaires locaux",
    "Stratégie de gestion des avis clients",
    "Optimisation Google Maps"
  ]
},
    {
  title: 'Analyses & Rapports',
  desc: 'Des chiffres sans contexte ne servent à rien. Nous mettons en place un suivi précis et vous envoyons des rapports mensuels pour comprendre ce qui fonctionne et définir les prochaines étapes.',
  cover: 'pi pi-chart-bar text-yellow-500',
  list: [
    "Configuration de Google Analytics",
    "Suivi Google Search Console",
    "Rapports de performance mensuels",
    "Veille et suivi de la concurrence"
  ]
},
    {
  title: 'Stratégie de Contenu',
  desc: 'Nous analysons ce que vos clients recherchent et créons des contenus qui répondent à leurs questions — permettant ainsi à Google de vous positionner comme l’autorité de votre secteur.',
  cover: 'pi pi-code text-violet-500',
  list: [
    "Planification de contenus de blog",
    "Optimisation des pages d'atterrissage",
    "Ciblage de mots-clés de longue traîne",
    "Actualisation des contenus existants"
  ]
},
    { title: 'Netlinking', desc: 'Des backlinks de qualité provenant de sites pertinents et fiables indiquent à Google que votre site est crédible. Nous les obtenons grâce à une véritable démarche de prospection — sans spam ni techniques de référencement douteuses.', cover: 'pi pi-link text-pink-500', list: [ "Acquisition de liens selon les bonnes pratiques SEO", "Soumissions dans des annuaires", "Prospection pour la publication d’articles invités", "Nettoyage des liens toxiques" ] },
    { title: 'Performance technique', desc: 'Vitesse du site, expérience mobile, Core Web Vitals et exploration par les moteurs de recherche. Nous corrigeons les problèmes techniques en arrière-plan qui peuvent discrètement nuire à votre classement dans les résultats de recherche.', cover: 'pi pi-desktop text-blue-500', list: [ "Optimisation de la vitesse des pages", "Optimisation des Core Web Vitals", "Adaptation aux appareils mobiles", "Résolution des erreurs d’exploration" ] }
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
