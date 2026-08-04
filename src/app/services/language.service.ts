import { computed, Injectable, signal } from "@angular/core";
import { fr } from "../config/content/fr";
import { en } from "../config/content/en";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

    language = signal<'fr'|'en'>('fr');

     content = computed(() => {

        return this.language() === 'fr'
            ? fr
            : en;

    });

}