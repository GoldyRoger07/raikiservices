import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

import { AuthService } from '../../../core/services/auth.service';
import { BlogService } from '../../../core/services/blog.service';
import { ContactService } from '../../../core/services/contact.service';
import { RoleService } from '../../../core/services/role.service';
import { UserService } from '../../../core/services/user.service';
import {
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_SEVERITY,
  ContactMessage,
} from '../../../core/models/contact.model';
import { HasPermission } from '../../../core/directives/has-permission';

/**
 * Accueil du back-office : quelques compteurs et les derniers messages reçus.
 *
 * <p>Chaque bloc dépend d'une permission : un compte qui n'a pas `READ_USER` ne déclenche pas
 * l'appel correspondant, ce qui évite un 403 inutile au chargement.
 */
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, TagModule, SkeletonModule, HasPermission],
  templateUrl: './dashboard.html',
})
export default class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly contacts = inject(ContactService);
  private readonly blog = inject(BlogService);
  private readonly users = inject(UserService);
  private readonly roles = inject(RoleService);

  protected readonly displayName = this.auth.displayName;
  protected readonly user = this.auth.user;

  protected readonly newMessages = signal<number | null>(null);
  protected readonly totalMessages = signal<number | null>(null);
  protected readonly totalUsers = signal<number | null>(null);
  protected readonly totalRoles = signal<number | null>(null);
  protected readonly totalPosts = signal<number | null>(null);

  protected readonly latest = signal<ContactMessage[]>([]);
  protected readonly loadingLatest = signal(false);

  protected readonly statusLabels = CONTACT_STATUS_LABELS;
  protected readonly statusSeverity = CONTACT_STATUS_SEVERITY;

  ngOnInit(): void {
    if (this.auth.has('READ_CONTACT')) {
      this.contacts.countNew().subscribe({ next: (count) => this.newMessages.set(count) });
      this.loadLatestMessages();
    }
    if (this.auth.has('READ_USER')) {
      this.users.list({ page: 0, size: 1 }).subscribe({
        next: (page) => this.totalUsers.set(page.totalElements),
      });
    }
    if (this.auth.has('READ_BLOG')) {
      this.blog.list({ page: 0, size: 1 }).subscribe({
        next: (page) => this.totalPosts.set(page.totalElements),
      });
    }
    if (this.auth.has('READ_ROLE')) {
      this.roles.list({ page: 0, size: 1 }).subscribe({
        next: (page) => this.totalRoles.set(page.totalElements),
      });
    }
  }

  private loadLatestMessages(): void {
    this.loadingLatest.set(true);
    this.contacts
      .list({ page: 0, size: 5, sortField: 'submittedAt', sortOrder: 'desc' })
      .subscribe({
        next: (page) => {
          this.latest.set(page.content);
          this.totalMessages.set(page.totalElements);
          this.loadingLatest.set(false);
        },
        error: () => this.loadingLatest.set(false),
      });
  }
}
