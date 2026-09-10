import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { User, UserCreateRequest, UserUpdateRequest } from '../models/user.model';
import { CrudApi } from './crud-api';

/**
 * Comptes du back-office.
 *
 * <p>Champs acceptés au tri : `username`, `email`, `firstName`, `lastName`, `position`,
 * `status`, `createdAt` (défaut). Tout autre nom est ignoré par le backend.
 */
@Injectable({ providedIn: 'root' })
export class UserService extends CrudApi<User, UserCreateRequest, UserUpdateRequest> {
  protected readonly resourceUrl = `${environment.apiUrl}/api/v1/users`;
}
