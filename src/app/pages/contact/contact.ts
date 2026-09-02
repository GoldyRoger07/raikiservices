import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { pageSeo } from '../../config/content/seo-pages';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { HeroSection } from "../../components/hero-section/hero-section";
import { Container } from "../../components/container/container";
import { SeparatorDesign } from '../../components/separator-design/separator-design';
import { MyButton } from "../../components/my-button/my-button";

@Component({
  selector: 'app-contact',
  imports: [Header, Footer, HeroSection, Container, SeparatorDesign, MyButton],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export default class Contact implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(pageSeo.contact);
  }
}
