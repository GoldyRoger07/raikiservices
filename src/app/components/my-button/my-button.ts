import { Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

/** Variantes visuelles du CTA — les seules autorisées sur le site, pour garder des boutons uniformes. */
export type MyButtonVariant = 'primary' | 'inverse' | 'outline';

const VARIANT_CLASSES: Record<MyButtonVariant, string> = {
  primary: 'bg-primary text-white',
  inverse: 'bg-white text-primary',
  outline: 'border border-gray-300 text-gray-800 hover:border-primary hover:text-primary',
};

@Component({
  selector: 'my-button',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './my-button.html',
  styleUrl: './my-button.css',
})
export class MyButton {
  /** Avec un lien, le CTA est rendu en `<a routerLink>` ; sans, en `<button>` (formulaires, actions). */
  link = input<string | readonly unknown[] | null>(null);
  queryParams = input<Record<string, string> | null>(null);
  type = input<'button' | 'submit'>('submit');
  variant = input<MyButtonVariant>('primary');
  fluid = input(false);

  protected readonly classes = computed(
    () =>
      `btn font-body rounded-full px-6 py-3 flex items-center justify-center gap-3 mx-auto md:mx-0 transition-colors ${
        this.fluid() ? 'w-full' : 'w-fit'
      } ${VARIANT_CLASSES[this.variant()]}`,
  );
}
