import { Component } from '@angular/core';
import { Header } from "../../../components/header/header";
import { Footer } from "../../../components/footer/footer";
import { HeroSection } from "../../../components/hero-section/hero-section";

@Component({
  selector: 'app-websites',
  imports: [Header, Footer, HeroSection],
  templateUrl: './websites.html',
  styleUrl: './websites.css',
})
export default class Websites {}
