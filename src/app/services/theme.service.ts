import { DOCUMENT, Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Theme } from "../models/theme.model";



@Injectable({
  providedIn: 'root'
})
export class ThemeService {

    constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  init(theme: Theme) {

    if(isPlatformBrowser(this.platformId)){

        const root = document.documentElement;
    
        Object.entries(theme.colors).forEach(([key, value]) => {
            console.log(`key= ${key} \nkebab=${this.toKebabCase(key)}`)
            root.style.setProperty(`--brand-${this.toKebabCase(key)}`, value  );
        });
    
        Object.entries(theme.radius).forEach(([key, value]) => {
          root.style.setProperty(`--radius-${this.toKebabCase(key)}`, value);
        });

        // Fonts
            Object.entries(theme.typography.fontFamily)
            .forEach(([key,value])=>{


                root.style.setProperty(
                    `--font-${this.toKebabCase(key)}`,
                    value as string
                );


            });

            // Sizes
            Object.entries(theme.typography.sizes)
            .forEach(([key,value])=>{


                root.style.setProperty(
                    `--text-${this.toKebabCase(key)}`,
                    value as string
                );


            });

             // Weights
            Object.entries(theme.typography.weights)
            .forEach(([key,value])=>{


                root.style.setProperty(
                    `--font-weight-${this.toKebabCase(key)}`,
                    value as unknown as string
                );


            });

            // Line heights
            Object.entries(theme.typography.lineHeights)
            .forEach(([key,value])=>{


                root.style.setProperty(
                    `--line-height-${this.toKebabCase(key)}`,
                    value as string
                );


            });
    }

  }

   toKebabCase(value: string): string {
        return value
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
            .replace(/_/g, '-')
            .toLowerCase();
    }

}