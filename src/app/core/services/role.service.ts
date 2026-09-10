import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Role, RoleRequest } from '../models/role.model';
import { CrudApi } from './crud-api';

/**
 * Rôles et leurs permissions.
 *
 * <p>Champs acceptés au tri : `name` (défaut) et `createdAt`.
 */
@Injectable({ providedIn: 'root' })
export class RoleService extends CrudApi<Role, RoleRequest> {
  protected readonly resourceUrl = `${environment.apiUrl}/api/v1/roles`;
}
