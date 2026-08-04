import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { Footer } from "../../components/footer/footer";
import { HeroSection } from "../../components/hero-section/hero-section";

@Component({
  selector: 'app-contact',
  imports: [Header, Footer, HeroSection],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export default class Contact {}
