import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { LaunchOfferState } from '../../../core/models/launch-offer.model';
import { LaunchOfferService } from '../../../core/services/launch-offer.service';
import { apiErrorMessage, apiFieldErrors } from '../../../core/utils/http.util';

/**
 * Réglage de l'offre de lancement : `/admin/offre`.
 *
 * <p>Le compteur ne s'incrémente pas tout seul — rien dans le système ne sait ce qu'est un
 * client signé. C'est une saisie, faite au moment où l'accord est conclu, et c'est elle qui
 * décide de ce qu'affiche la page des tarifs.
 */
@Component({
  selector: 'app-launch-offer',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    ToggleSwitchModule,
    TagModule,
    SkeletonModule,
  ],
  templateUrl: './launch-offer.html',
})
export default class LaunchOffer implements OnInit {
  private readonly offers = inject(LaunchOfferService);
  private readonly toast = inject(MessageService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly state = signal<LaunchOfferState | null>(null);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly formError = signal('');

  protected readonly form = this.formBuilder.nonNullable.group({
    active: [true],
    totalSlots: [10, [Validators.required, Validators.min(1), Validators.max(999)]],
    claimedSlots: [0, [Validators.required, Validators.min(0)]],
  });

  /** Aperçu de ce que verra le visiteur, recalculé à la saisie sans attendre l'enregistrement. */
  protected readonly preview = computed(() => {
    const state = this.state();
    if (!state) {
      return null;
    }
    return {
      remaining: Math.max(0, state.totalSlots - state.claimedSlots),
      running: state.running,
    };
  });

  ngOnInit(): void {
    this.offers.get().subscribe({
      next: (state) => {
        this.apply(state);
        this.loading.set(false);
      },
      error: (failure: unknown) => {
        this.loading.set(false);
        this.formError.set(apiErrorMessage(failure));
      },
    });
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (value.claimedSlots > value.totalSlots) {
      this.formError.set(
        'Le nombre de places attribuées ne peut pas dépasser le nombre de places ouvertes.',
      );
      return;
    }

    this.saving.set(true);
    this.formError.set('');

    this.offers.update(value).subscribe({
      next: (state) => {
        this.apply(state);
        this.saving.set(false);
        this.toast.add({
          severity: 'success',
          summary: 'Offre mise à jour',
          detail: state.running
            ? `L'offre est visible, ${state.remainingSlots} place(s) restante(s).`
            : 'L’offre n’est plus affichée sur la page des tarifs.',
        });
      },
      error: (failure: unknown) => {
        this.saving.set(false);
        const fields = apiFieldErrors(failure);
        this.formError.set(Object.values(fields)[0] ?? apiErrorMessage(failure));
      },
    });
  }

  /** Une place de plus attribuée : le geste le plus fréquent, d'où son propre bouton. */
  protected claimOne(): void {
    const claimed = this.form.controls.claimedSlots.value;
    const total = this.form.controls.totalSlots.value;
    if (claimed >= total) {
      return;
    }
    this.form.controls.claimedSlots.setValue(claimed + 1);
    this.save();
  }

  private apply(state: LaunchOfferState): void {
    this.state.set(state);
    this.form.reset({
      active: state.active,
      totalSlots: state.totalSlots,
      claimedSlots: state.claimedSlots,
    });
  }
}
