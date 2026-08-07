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
      title: 'Search Rankings',
      desc: 'We optimize your site\'s structure, content, speed, and backlinks so Google ranks you higher for the keywords your customers actually search for.',
      cover: 'pi pi-chart-line text-gray-500',
      list: [
        "Keyword research & strategy",
        "On-page optimization",
        "Technical SEO audits",
        "Content recommendations"
      ]
    },
    {
      title: 'Local SEO',
      desc: 'Get your business on Google Maps, the local 3-pack, and local directories. We create and manage your Google Business Profile so customers find you first.',
      cover: 'pi pi-map-marker text-green-500',
      list: [
        "Google Business Profile setup",
        "Local directory submissions",
        "Review management strategy",
        "Google Maps optimization"
      ]
    },
    {
      title: 'Analytics & Reporting',
      desc: 'Numbers without context are useless. We set up proper tracking and send you monthly reports that actually tell you what\'s working and what to do next.',
      cover: 'pi pi-chart-bar text-yellow-500',
      list: [
        "Google Analytics setup",
        "Search Console monitoringn",
        "Monthly performance reports",
        "Competitor tracking"
      ]
    },
    {
      title: 'Content Strategy',
      desc: 'We research what your customers are searching for and create content that answers their questions — so Google sees you as the authority in your space.',
      cover: 'pi pi-code text-violet-500',
      list: [
        "Blog content planning",
        "Landing page optimization",
        "Long-tail keyword targeting",
        "Existing content refresh"
      ]
    },
    {
      title: 'Link Building',
      desc: 'Quality backlinks from relevant, trusted websites tell Google your site is credible. We earn them through real outreach — not spam or black hat tricks.',
      cover: 'pi pi-link text-pink-500',
      list: [
        "White-hat link acquisition",
        "Directory submissions",
        "Guest posting outreach",
        "Toxic link cleanup"
      ]
    },
    {
      title: 'Technical Performance',
      desc: 'Site speed, mobile usability, Core Web Vitals, and crawlability. We fix the behind-the-scenes issues that silently kill your rankings.',
      cover: 'pi pi-desktop text-blue-500',
      list: [
        "Page speed optimization",
        "Core Web Vitals fixes",
        "Mobile responsiveness",
        "Crawl error resolution"
      ]
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
