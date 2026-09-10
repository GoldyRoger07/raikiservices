import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';

import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification, NOTIFICATION_ROUTES } from '../../../core/models/notification.model';

/**
 * Cloche de la barre supérieure : compteur, dix dernières notifications, marquage comme lu.
 *
 * <p>La liste est rechargée à l'ouverture du panneau plutôt que maintenue en permanence : les
 * arrivées en direct n'ont qu'à faire bouger le compteur, tenu par le service.
 */
@Component({
  selector: 'app-notification-bell',
  imports: [PopoverModule, BadgeModule, ButtonModule, DatePipe],
  templateUrl: './notification-bell.html',
  styleUrl: './notification-bell.css',
})
export class NotificationBell implements OnInit, OnDestroy {
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly unreadCount = this.notifications.unreadCount;
  protected readonly items = signal<AppNotification[]>([]);
  protected readonly loading = signal(false);

  private liveEvents?: Subscription;

  ngOnInit(): void {
    // Une notification reçue pendant que le panneau est fermé doit apparaître à la prochaine
    // ouverture : on invalide la liste plutôt que d'y insérer un élément partiel.
    this.liveEvents = this.notifications.events.subscribe(() => this.items.set([]));
  }

  ngOnDestroy(): void {
    this.liveEvents?.unsubscribe();
  }

  protected load(): void {
    this.loading.set(true);
    this.notifications.list(0, 10).subscribe({
      next: (page) => {
        this.items.set(page.content);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected open(notification: AppNotification): void {
    if (!notification.read) {
      this.notifications.markAsRead(notification.id).subscribe({ error: () => void 0 });
      this.items.update((list) =>
        list.map((item) => (item.id === notification.id ? { ...item, read: true } : item)),
      );
    }

    const route = NOTIFICATION_ROUTES[notification.type];
    if (route) {
      const target = notification.entityId ? `${route}/${notification.entityId}` : route;
      void this.router.navigateByUrl(target);
    }
  }

  protected markAllAsRead(): void {
    this.notifications.markAllAsRead().subscribe({
      next: () => this.items.update((list) => list.map((item) => ({ ...item, read: true }))),
      error: () => void 0,
    });
  }
}
