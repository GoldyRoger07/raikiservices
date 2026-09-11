import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../services/seo.service';
import { pageSeo } from '../../config/content/seo-pages';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { Container } from "../../components/container/container";
import { MyButton } from "../../components/my-button/my-button";
import { SeparatorDesign } from "../../components/separator-design/separator-design";
import { NgxParticlesComponent } from '@omnedia/ngx-particles';
import { NgxTypewriterComponent } from '@omnedia/ngx-typewriter';
import { CardData } from '../../models/card-data.model';
import { AccentTitle } from '../../components/accent-title/accent-title';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectCard } from '../../components/project-card/project-card';
import { Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/services/project.service';



@Component({
  selector: 'app-home',
  imports: [Header, Footer, Container, AccentTitle, MyButton, SeparatorDesign, NgxParticlesComponent, NgxTypewriterComponent, CommonModule, ProjectCard, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export default class Home implements OnInit{

  // Particules rendues au navigateur uniquement (canvas incompatible prerender).
  protected readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly seo = inject(SeoService);
  private readonly projects = inject(ProjectService);

  /** Réalisations mises en avant. Vide tant qu'elles ne sont pas chargées. */
  protected readonly featuredProjects = signal<Project[]>([]);

  title1 = "Nous créons des sites web modernes qui rendent votre entreprise plus visible et attirent plus de clients."
  title2 = " plus de visibilité pour votre entreprise."
  cursorColor1 = signal('#1e2939')
  cursorColor2 = signal('transparent')


  ourWorkCards: CardData[] = [
    {
      subtitle: 'Création de sites web',
      title: 'Un site conçu autour de votre entreprise.',
      desc: 'Des sites modernes, rapides et adaptés à tous les écrans.',
      cover: "img/home/our-work/07.png"
    },
    {
      subtitle: 'SEO',
      title: 'Soyez trouvé par vos futurs clients.',
      desc: 'Optimisez votre visibilité sur Google et attirez un trafic plus qualifié.',
      cover: "img/home/our-work/12.png"
    },
    {
      subtitle: 'E-mail professionnel',
      title: 'Une adresse qui inspire confiance.',
      desc: 'Renforcez votre crédibilité avec une adresse e-mail professionnelle liée à votre entreprise.',
      cover: "img/home/our-work/13.png"
    },
    {
      subtitle: 'E-commerce',
      title: 'Vendez en ligne, même quand vous dormez.',
      desc: 'Une boutique pensée pour présenter vos produits et faciliter les achats.',
      cover: "img/home/our-work/04.svg"
    },
    {
      subtitle: 'Maintenance & Hébergement',
      title: 'Votre site reste rapide, sécurisé et disponible.',
      desc: 'Hébergement, nom de domaine, mises à jour et sauvegardes sont compris dans votre abonnement mensuel.'
    }
  ]

  avantageCards: CardData[] = [
    {
      title: 'Pensé pour vos objectifs',
      desc: 'Votre site est conçu selon vos besoins et non à partir d\'un modèle générique.'
    },
    {
      title: 'Design qui inspire confiance',
      desc: 'Une présence professionnelle qui donne à vos visiteurs une bonne raison de vous choisir.'
    },
    {
      title: 'Optimisé pour les résultats',
      desc: 'Performance, mobile, SEO et conversion sont intégrés dès la conception.'
    },
    {
      title: 'Un accompagnement à long terme',
      desc: 'Nous pouvons continuer à gérer, maintenir et faire évoluer votre site après son lancement.'
    }
  ]

  processCards: CardData[] = [
    {
      subtitle: 'Échange',
      title: 'On comprend votre entreprise.',
      desc: 'Nous discutons de vos objectifs, de votre activité et de ce que votre site doit accomplir.'
    },
    {
      subtitle: 'Conception',
      title: 'Nous construisons votre solution.',
      desc: 'Design, contenu et fonctionnalités sont pensés autour de votre audience.'
    },
    {
      subtitle: 'Développement',
      title: 'Votre site prend vie.',
      desc: 'Nous transformons la conception en un site rapide, responsive et optimisé.'
    },
    {
      subtitle: 'Lancement',
      title: 'Votre entreprise est prête à avancer.',
      desc: 'Nous mettons votre site en ligne et vous accompagnons pour la suite.'
    },

    
  ] 
  

  ngOnInit(): void {
    this.seo.update(pageSeo.home);
    this.loadFeaturedProjects();

    setTimeout(()=>{
      this.cursorColor1.set("transparent")
      this.cursorColor2.set("#1e2939")

      setTimeout(()=>{
        this.cursorColor2.set("transparent")
      },this.title2.length*120)

    },this.title1.length*120)

    
  }
  /**
   * Réalisations mises en avant.
   *
   * <p>L'accueil est désormais rendu à la demande et non plus figé au build : c'est ce qui
   * permet à une publication depuis le back-office d'y apparaître aussitôt. En contrepartie
   * la page dépend d'un appel réseau, d'où le silence en cas d'échec — l'API endormie ou en
   * erreur laisse simplement la section de côté, elle ne casse pas la page la plus visitée
   * du site.
   */
  private loadFeaturedProjects(): void {
    this.projects.listFeatured(4).subscribe({
      next: (page) => this.featuredProjects.set(page.content),
      error: () => this.featuredProjects.set([]),
    });
  }
}
