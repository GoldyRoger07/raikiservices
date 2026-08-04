import { Component, inject } from '@angular/core';
import { Container } from "../container/container";
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'my-footer',
  imports: [Container],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  company = inject(CompanyService).company
}
