import { Component, OnInit, signal } from '@angular/core';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { Container } from "../../components/container/container";
import { MyButton } from "../../components/my-button/my-button";
import { SeparatorDesign } from "../../components/separator-design/separator-design";
import { Image } from 'primeng/image';
import { NgxParticlesComponent } from '@omnedia/ngx-particles';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';
import { NgxNumberTickerComponent } from '@omnedia/ngx-number-ticker';
import { CardData } from '../../models/card-data.model';



@Component({
  selector: 'app-home',
  imports: [Header, Footer, Container, MyButton, SeparatorDesign, Image, NgxParticlesComponent, NgxTypewriterComponent, NgxNumberTickerComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export default class Home implements OnInit{
  

  title1 = "Nous créons des sites web modernes qui attirent"
  title2 = " plus de visibilité pour votre entreprise."
  cursorColor1 = signal('#1e2939')
  cursorColor2 = signal('transparent')


  ourWorkCards: CardData[] = [
    {
      title: 'Creation de site web',
      desc: 'Des sites web sur mesure, adaptés aux appareils mobiles et conçus pour transformer vos visiteurs en clients.',
      cover: "img/home/our-work/07.png"
    },
    {
      title: 'SEO',
      desc: 'Gagnez en visibilité sur Google grâce à un site optimisé pour apparaître devant vos concurrents.',
      cover: "img/home/our-work/12.png"
    },
    {
      title: 'E-mail professionnel',
      desc: 'Une adresse e-mail professionnelle qui renforce votre crédibilité et inspire confiance à vos clients.',
      cover: "img/home/our-work/13.png"
    },
    {
      title: 'Boutique en ligne',
      desc: 'Une boutique en ligne performante qui vend vos produits 24 h/24 et 7 j/7 grâce à un processus de paiement sécurisé.',
      cover: "img/home/our-work/04.svg"
    }
  ]

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
  

  ngOnInit(): void {
    setTimeout(()=>{
      this.cursorColor1.set("transparent")
      this.cursorColor2.set("#1e2939")

      setTimeout(()=>{
        this.cursorColor2.set("transparent")
      },this.title2.length*120)

    },this.title1.length*120)

    
  }
}
