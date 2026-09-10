import { Component, OnInit, inject } from '@angular/core';

import { LegalPage } from '../../../components/legal-page/legal-page';
import { politiqueCookies } from '../../../config/content/legal';
import { pageSeo } from '../../../config/content/seo-pages';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-politique-de-cookies',
  imports: [LegalPage],
  template: '<my-legal-page [document]="document" />',
})
export default class PolitiqueDeCookies implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly document = politiqueCookies;

  ngOnInit(): void {
    this.seo.update(pageSeo.cookies);
  }
}
