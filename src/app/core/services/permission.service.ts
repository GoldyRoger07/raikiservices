import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Permission, PermissionRequest } from '../models/permission.model';
import { CrudApi } from './crud-api';

/**
 * Référentiel des permissions.
 *
 * <p>Champs acceptés au tri : `name` (défaut), `module`, `action`, `createdAt`.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService extends CrudApi<Permission, PermissionRequest> {
  protected readonly resourceUrl = `${environment.apiUrl}/api/v1/permissions`;
}
