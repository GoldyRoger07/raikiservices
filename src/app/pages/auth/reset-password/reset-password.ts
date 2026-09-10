import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../../core/services/auth.service';
import { apiErrorMessage } from '../../../core/utils/http.util';
import { AuthCard } from '../auth-card/auth-card';

/** Vérifie que la confirmation reprend bien le mot de passe saisi. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('newPassword')?.value;
  const confirmation = group.get('confirmation')?.value;
  return password && confirmation && password !== confirmation ? { mismatch: true } : null;
}

/**
 * Cible du lien reçu par email : le jeton arrive en paramètre `token` de l'URL.
 *
 * <p>Le chemin `/reset-password` est écrit en dur dans les emails du backend
 * (`EmailService`) : le renommer casserait les liens déjà envoyés.
 */
@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, AuthCard, ButtonModule, PasswordModule, MessageModule],
  templateUrl: './reset-password.html',
})
export default class ResetPassword {
  private readonly auth = inject(AuthService);

  private readonly token = inject(ActivatedRoute).snapshot.queryParamMap.get('token') ?? '';

  protected readonly loading = signal(false);
  protected readonly done = signal(false);
  protected readonly error = signal('');
  protected readonly tokenMissing = this.token.length === 0;

  protected readonly form = inject(FormBuilder).nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmation: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  protected submit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.auth
      .resetPassword({ token: this.token, newPassword: this.form.getRawValue().newPassword })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.done.set(true);
        },
        error: (failure: unknown) => {
          this.loading.set(false);
          this.error.set(
            apiErrorMessage(failure, 'Ce lien est invalide ou a expiré. Demandez-en un nouveau.'),
          );
        },
      });
  }
}
