import { Component, OnInit, inject } from '@angular/core';

import { LegalPage } from '../../../components/legal-page/legal-page';
import { politiqueConfidentialite } from '../../../config/content/legal';
import { pageSeo } from '../../../config/content/seo-pages';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-politique-de-confidentialite',
  imports: [LegalPage],
  template: '<my-legal-page [document]="document" />',
})
export default class PolitiqueDeConfidentialite implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly document = politiqueConfidentialite;

  ngOnInit(): void {
    this.seo.update(pageSeo.privacy);
  }
}
