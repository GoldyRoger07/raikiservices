import { Component, OnInit, inject } from '@angular/core';

import { LegalPage } from '../../../components/legal-page/legal-page';
import { conditionsGenerales } from '../../../config/content/legal';
import { pageSeo } from '../../../config/content/seo-pages';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-conditions-generales',
  imports: [LegalPage],
  template: '<my-legal-page [document]="document" />',
})
export default class ConditionsGenerales implements OnInit {
  private readonly seo = inject(SeoService);

  protected readonly document = conditionsGenerales;

  ngOnInit(): void {
    this.seo.update(pageSeo.terms);
  }
}
