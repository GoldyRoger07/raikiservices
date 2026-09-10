import { Component, OnInit, inject } from '@angular/core';

import { LegalPage } from '../../../components/legal-page/legal-page';
import { mentionsLegales } from '../../../config/content/legal';
import { pageSeo } from '../../../config/content/seo-pages';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-mentions-legales',
  imports: [LegalPage],
  template: '<my-legal-page [document]="document" />',
})
export default class MentionsLegales implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly document = mentionsLegales;

  ngOnInit(): void {
    this.seo.update(pageSeo.mentionsLegales);
  }
}
