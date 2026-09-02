import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { pageSeo } from '../../config/content/seo-pages';
import { HeroSection } from "../../components/hero-section/hero-section";
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { Container } from "../../components/container/container";
import { SeparatorDesign } from "../../components/separator-design/separator-design";
import { CardData } from '../../models/card-data.model';
import { MyButton } from "../../components/my-button/my-button";

@Component({
  selector: 'app-pricing',
  imports: [HeroSection, Header, Footer, Container, SeparatorDesign, MyButton],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css',
})
export default class Pricing implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(pageSeo.pricing);
  }


  pricingCards: CardData[] = [
    {
      title: 'Starter',
      desc: 'Get online fast and start getting found',
      pricing: 2600,
      list: [
        "Custom responsive website",
        "Domain, hosting, SSL & security",
        "1 Google Workspace Email",
        "ADA/accessibility compliant",
        "10 content updates per month",
        "Speed optimized",
        "Basic SEO setup",
        "Basic analytics",
        "Monthly uptime monitoring",
        "Basic e-commerce"
      ],
      link: ""
    },
    {
      title: 'Professional',
      desc: 'Everything you need to outrank competitors',
      pricing: 4549,
      list: [
        "Everything in Starter",
        "Premium custom design",
        "3 Google Workspace Emails",
        "Google Business management",
        "On-page SEO optimization",
        "1–2 SEO blog posts per month",
        "Google Business Profile optimization",
        "Unlimited content updates",
        "Booking and CRM Systems",
        "Google Analytics & monthly report",
        "Fully customized e-commerce",
        "Priority support"
      ],
      link: ""
    },
    {
      title: 'Business',
      desc: 'Your full digital team, on demand',
      pricing: 5200,
      list: [
        "Everything in Professional",
        "Custom software development",
        "One team managing every website, storefront & listing",
        "5 Google Workspace Emails",
        "Google Business management",
        "Custom SEO strategy & executio",
        "AI chatbot or automation",
        "Advanced Google Analytics & dashboard",
        "Dedicated account manager",
        "Same-day support"
      ],
      link: ""
    }
  ]
}
