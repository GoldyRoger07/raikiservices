import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/http.util';
import { AuthCard } from '../auth-card/auth-card';

/**
 * Demande de réinitialisation.
 *
 * <p>Le backend répond la même chose que l'adresse existe ou non : l'écran affiche donc un
 * message neutre, sans jamais confirmer qu'un compte est associé à l'adresse saisie.
 */
@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, AuthCard, ButtonModule, InputTextModule, MessageModule],
  templateUrl: './forgot-password.html',
})
export default class ForgotPassword {
  private readonly auth = inject(AuthService);

  protected readonly loading = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth.forgotPassword(this.form.getRawValue().email).subscribe({
      next: () => {
        this.loading.set(false);
        this.sent.set(true);
      },
      error: (failure: unknown) => {
        this.loading.set(false);
        this.error.set(apiErrorMessage(failure));
      },
    });
  }
}
