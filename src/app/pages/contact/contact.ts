import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { contactFaq } from '../../config/content/faq';
import { pageSeo } from '../../config/content/seo-pages';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { HeroSection } from '../../components/hero-section/hero-section';
import { Container } from '../../components/container/container';
import { SeparatorDesign } from '../../components/separator-design/separator-design';
import { MyButton } from '../../components/my-button/my-button';
import { FaqSection } from '../../components/faqs/faq-section/faq-section';
import { ContactService } from '../../core/services/contact.service';
import { apiErrorMessage, apiFieldErrors } from '../../core/utils/http.util';

@Component({
  selector: 'app-contact',
  imports: [
    Header,
    Footer,
    HeroSection,
    Container,
    SeparatorDesign,
    MyButton,
    FaqSection,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export default class Contact implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly contacts = inject(ContactService);
  private readonly route = inject(ActivatedRoute);

  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');

  /** Questions fréquentes du bas de page. */
  protected readonly faq = contactFaq;

  /** Prestations proposées dans le sélecteur ; reprises telles quelles en base. */
  protected readonly services = [
    'Création de site web',
    'Boutique en ligne',
    'Refonte de site',
    'Référencement (SEO)',
    'Hébergement et maintenance',
    'Autre',
  ];

  protected readonly form = inject(FormBuilder).nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    phone: ['', [Validators.maxLength(30)]],
    companyName: ['', [Validators.maxLength(150)]],
    serviceCategory: [''],
    subject: ['', [Validators.maxLength(200)]],
    message: ['', [Validators.required, Validators.maxLength(5000)]],
    newsletterOptIn: [false],
  });

  ngOnInit(): void {
    this.seo.update(pageSeo.contact);

    // Sujet prérempli depuis une autre page — « Je candidate à l'offre » sur les tarifs, par
    // exemple. Cela distingue ces demandes des autres dès la liste du back-office, sans que
    // le visiteur ait à expliquer d'où il vient.
    const subject = this.route.snapshot.queryParamMap.get('sujet')?.trim();
    if (subject) {
      this.form.controls.subject.setValue(subject.slice(0, 200));
    }
  }

  protected submit(): void {
    if (this.form.invalid || this.sending()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.sending.set(true);
    this.error.set('');

    this.contacts
      .submit({
        firstName: value.firstName.trim(),
        lastName: value.lastName.trim() || null,
        email: value.email.trim(),
        phone: value.phone.trim() || null,
        companyName: value.companyName.trim() || null,
        serviceCategory: value.serviceCategory || null,
        subject: value.subject.trim() || null,
        message: value.message.trim(),
        newsletterOptIn: value.newsletterOptIn,
      })
      .subscribe({
        next: () => {
          this.sending.set(false);
          this.sent.set(true);
          this.form.reset();
        },
        error: (failure: unknown) => {
          this.sending.set(false);
          // Le backend valide champ par champ : on remonte le premier message précis
          // plutôt qu'un « une erreur est survenue » qui n'aide personne à corriger.
          const fields = apiFieldErrors(failure);
          this.error.set(
            Object.values(fields)[0] ??
              apiErrorMessage(failure, "Votre message n'a pas pu être envoyé. Réessayez."),
          );
        },
      });
  }
}
