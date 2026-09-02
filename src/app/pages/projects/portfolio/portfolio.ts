import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { pageSeo } from '../../../config/content/seo-pages';
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
export default class Portfolio implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(pageSeo.portfolio);
  }



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
