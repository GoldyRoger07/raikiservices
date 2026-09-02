import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../../services/seo.service';
import { pageSeo } from '../../../config/content/seo-pages';
import { Header } from "../../../components/header/header";
import { Footer } from "../../../components/footer/footer";
import { HeroSection } from "../../../components/hero-section/hero-section";
import { CtaSection } from "../../../components/cta-section/cta-section";
import { Container } from "../../../components/container/container";
import { SeparatorDesign } from "../../../components/separator-design/separator-design";
import { CardData } from '../../../models/card-data.model';

@Component({
  selector: 'app-case-studies',
  imports: [Header, Footer, HeroSection, CtaSection, Container, SeparatorDesign],
  templateUrl: './case-studies.html',
  styleUrl: './case-studies.css',
})
export default class CaseStudies implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(pageSeo.caseStudies);
  }


  projets: CardData[] = [
    {
      title: 'True Path Law',
      subtitle: 'Accident & Personal Injury Law Firm — Boston, MA',
      cover: 'img/home/projets/mockup-raf.png',
      icon: 'pi pi-desktop',
      desc: 'True Path Law reached out to build a brand new website targeting customers in the Boston area, with a focus on reaching the Spanish-speaking community. We delivered a fully bilingual site optimized for local search and set them up with everything they need to grow.',
      link: '',
      list: ["Web Design", "SEO", "Multilingual", "Analytics", "Hosting", "Business Email", "Full Management"]
    },
    {
      title: 'True Path Law',
      subtitle: 'Accident & Personal Injury Law Firm — Boston, MA',
      cover: 'img/home/projets/mockup-raf.png',
      icon: 'pi pi-desktop',
      desc: 'True Path Law reached out to build a brand new website targeting customers in the Boston area, with a focus on reaching the Spanish-speaking community. We delivered a fully bilingual site optimized for local search and set them up with everything they need to grow.',
      link: '',
      list: ["Web Design", "SEO", "Multilingual", "Analytics", "Hosting", "Business Email", "Full Management"]
    }
  ]
}
