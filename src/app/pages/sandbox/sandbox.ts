import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { pageSeo } from '../../config/content/seo-pages';
import { Container } from "../../components/container/container";
import { SeparatorDesign } from "../../components/separator-design/separator-design";

@Component({
  selector: 'app-sandbox',
  imports: [Container, SeparatorDesign],
  templateUrl: './sandbox.html',
  styleUrl: './sandbox.css',
})
export default class Sandbox implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update(pageSeo.sandbox);
  }
}
