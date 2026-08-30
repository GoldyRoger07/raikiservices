import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../theme/theme.service';
import { Container } from "../container/container";
import { CompanyService } from '../../services/company.service';
import { MyButton } from "../my-button/my-button";
// import { My3dButton } from "../buttons/my3d-button/my3d-button";
import { PopoverModule } from 'primeng/popover';
import { RouterLink } from '@angular/router';
import { NavItem } from '../../models/nav-item.model';
import { Dropdown } from "../dropdown/dropdown";


// interface NavItem {
//   label: string;
//   link: string;
// }

@Component({
  selector: 'my-header',
  imports: [Container, MyButton, PopoverModule, RouterLink, Dropdown],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly themeService = inject(ThemeService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly companyService = inject(CompanyService)
  company = this.companyService.company
  
  protected readonly theme = this.themeService.theme;
  protected readonly menuOpen = signal(false);

  /** Vrai quand le header doit être masqué (scroll vers le bas). */
  protected readonly hidden = signal(false);
  protected readonly onTop = signal(true);
  private lastScrollY = 0;

  protected readonly navItems: NavItem[] = [
    { label: 'A propos', link: '/a-propos' },
    { label: 'Services', children: [
      {
        label: 'Web Design',
        subtitle: 'Des sites web personnaliser qui transforme vos visiteurs en clients',
        url: '/sites-web',
        icon: 'pi pi-desktop'
      },
      {
        label: 'SEO',
        subtitle: 'Améliorez votre classement sur Google et générez du trafic organique.',
        url: '/seo',
        icon: 'pi pi-search-plus'
      }
    ] },
    { label: 'Projets', children:[
      {
        label: 'Études de cas',
        subtitle: 'Des résultats détaillés issus de projets réalisés pour de vrais clients.',
        url: '/etudes-de-cas',
        icon: 'pi pi-file'
      },
      {
        label: 'Portfolio',
        subtitle: 'Découvrez notre galerie de créations de sites web.',
        url: '/portfolio',
        icon: 'pi pi-th-large'
      }
    ] },
    { label: 'Tarifs', link: '/tarifs' }, 
    { label: 'Contact', link: '/contact' },
  ];

  @HostListener('window:scroll')
  protected onScroll(): void {
    
    if (!this.isBrowser) {
      return;
    }
    const current = window.scrollY;

    // On garde le header visible tant que le menu mobile est ouvert.
    if (this.menuOpen()) {
      this.lastScrollY = current;
      return;
    }

    // Masque au scroll vers le bas (au-delà d'un petit seuil), réaffiche
    // dès qu'on remonte.
    if (current > this.lastScrollY && current > 80) {
      this.hidden.set(true);
    } else if (current < this.lastScrollY) {
      this.hidden.set(false);
    }

    if(current === 0)
      this.onTop.set(true)
    else
      this.onTop.set(false)

    this.lastScrollY = current;

    
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
}
