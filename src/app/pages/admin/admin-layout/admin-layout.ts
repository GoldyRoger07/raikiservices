import { Component, OnDestroy, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { ContactService } from '../../../core/services/contact.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CompanyService } from '../../../services/company.service';
import { ThemeService } from '../../../theme/theme.service';
import { NotificationBell } from '../notification-bell/notification-bell';

/** Entrée de navigation du menu latéral. */
interface AdminNavItem {
  label: string;
  icon: string;
  route: string;
  /** Permissions ouvrant l'accès ; vide = visible par tout compte connecté. */
  permissions: readonly string[];
  /** Nom du compteur à afficher en pastille, s'il y en a un. */
  badge?: 'contact';
}

/**
 * Ossature du back-office : menu latéral, barre supérieure, zone de contenu.
 *
 * <p>Le menu ne montre que les écrans accessibles au compte connecté. Ce filtrage est un
 * confort d'affichage : chaque route porte en plus son garde de permission, et le backend
 * refuse de toute façon la donnée à qui n'y a pas droit.
 */
@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    BadgeModule,
    MenuModule,
    NotificationBell,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
  // Fournis ici plutôt qu'à la racine : les toasts et les confirmations n'existent que dans
  // le back-office, et les pages vitrine n'ont pas à les embarquer dans leur bundle initial.
  // Les écrans enfants les récupèrent par l'injecteur de ce composant.
  providers: [MessageService, ConfirmationService],
})
export default class AdminLayout implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly contacts = inject(ContactService);
  private readonly notifications = inject(NotificationService);
  private readonly themeService = inject(ThemeService);

  protected readonly company = inject(CompanyService).company;
  protected readonly user = this.auth.user;
  protected readonly displayName = this.auth.displayName;
  protected readonly initials = this.auth.initials;
  protected readonly theme = this.themeService.theme;

  /** Menu latéral déployé sur mobile ; toujours visible à partir de `lg`. */
  protected readonly menuOpen = signal(false);

  /** Messages de contact encore au statut « Nouveau ». */
  protected readonly newContacts = signal(0);

  private liveEvents?: Subscription;

  private readonly navItems: readonly AdminNavItem[] = [
    { label: 'Tableau de bord', icon: 'pi pi-home', route: '/admin', permissions: [] },
    {
      label: 'Messages',
      icon: 'pi pi-inbox',
      route: '/admin/contact',
      permissions: ['READ_CONTACT'],
      badge: 'contact',
    },
    { label: 'Blog', icon: 'pi pi-file-edit', route: '/admin/blog', permissions: ['READ_BLOG'] },
    {
      label: 'Réalisations',
      icon: 'pi pi-briefcase',
      route: '/admin/projets',
      permissions: ['READ_PROJECT'],
    },
    { label: 'Images', icon: 'pi pi-images', route: '/admin/medias', permissions: ['READ_MEDIA'] },
    {
      label: 'Offre de lancement',
      icon: 'pi pi-megaphone',
      route: '/admin/offre',
      permissions: ['READ_SETTING'],
    },
    {
      label: 'Utilisateurs',
      icon: 'pi pi-users',
      route: '/admin/users',
      permissions: ['READ_USER'],
    },
    { label: 'Rôles', icon: 'pi pi-shield', route: '/admin/roles', permissions: ['READ_ROLE'] },
    {
      label: 'Permissions',
      icon: 'pi pi-key',
      route: '/admin/permissions',
      permissions: ['READ_PERMISSION'],
    },
    {
      label: 'Sessions',
      icon: 'pi pi-desktop',
      route: '/admin/sessions',
      permissions: ['READ_SESSION'],
    },
  ];

  /** Entrées réellement accessibles au compte connecté. */
  protected readonly visibleNav = computed(() =>
    this.navItems.filter((item) => this.auth.hasAny(item.permissions)),
  );

  /** Menu du compte, dans la barre supérieure. */
  protected readonly accountMenu: MenuItem[] = [
    { label: 'Mon profil', icon: 'pi pi-user', routerLink: '/admin/profil' },
    { label: 'Voir le site', icon: 'pi pi-external-link', routerLink: '/' },
    { separator: true },
    { label: 'Se déconnecter', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  constructor() {
    // Le flux temps réel porte le jeton d'accès dans son URL : il faut donc le rouvrir après
    // chaque rafraîchissement de jeton, sans quoi il resterait fermé jusqu'au rechargement.
    effect(() => {
      const token = this.auth.accessToken();
      this.notifications.disconnect();
      if (token) {
        this.notifications.connect();
      }
    });
  }

  ngOnInit(): void {
    this.notifications.refreshUnreadCount().subscribe({ error: () => void 0 });
    this.loadNewContacts();

    // Un message déposé sur le site pendant la session doit faire bouger la pastille.
    this.liveEvents = this.notifications.events.subscribe((event) => {
      if (event.type === 'NEW_CONTACT') {
        this.loadNewContacts();
      }
    });
  }

  ngOnDestroy(): void {
    this.liveEvents?.unsubscribe();
    this.notifications.disconnect();
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

  protected badgeFor(item: AdminNavItem): number {
    return item.badge === 'contact' ? this.newContacts() : 0;
  }

  private loadNewContacts(): void {
    if (!this.auth.has('READ_CONTACT')) {
      return;
    }
    this.contacts.countNew().subscribe({
      next: (count) => this.newContacts.set(count),
      error: () => void 0,
    });
  }

  private logout(): void {
    this.notifications.disconnect();
    this.auth.logout().subscribe(() => void this.router.navigate(['/login']));
  }
}
