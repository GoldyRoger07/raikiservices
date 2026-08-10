import { Component } from '@angular/core';
import { CtaSection } from "../../../components/cta-section/cta-section";
import { Container } from "../../../components/container/container";
import { SeparatorDesign } from "../../../components/separator-design/separator-design";
import { Header } from "../../../components/header/header";
import { HeroSection } from "../../../components/hero-section/hero-section";
import { Footer } from "../../../components/footer/footer";
import { MyButton } from "../../../components/my-button/my-button";
import { CardData } from '../../../models/card-data.model';
import { Image } from "primeng/image";

@Component({
  selector: 'app-portfolio',
  imports: [CtaSection, Container, SeparatorDesign, Header, HeroSection, Footer, MyButton, Image],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export default class Portfolio {


    projectCards: CardData[] = [
      {
        title: 'Raf',
        desc: '',
        cover: '/img/home/projets/mockup-raf.png'
      },
      {
        title: 'FShop',
        desc: '',
        cover: '/img/home/projets/mockup-raf.png'
      },
      {
        title: 'Bowom',
        desc: '',
        cover: '/img/home/projets/mockup-raf.png'
      },
      {
        title: 'Michael\'s',
        desc: '',
        cover: '/img/home/projets/mockup-raf.png'
      },
    ]
    
}
