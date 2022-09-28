import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from '@shared/services/api.service';
import { IUser } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class UserService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseRestService<IUser> implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof UserService
   */
  public endpoint: string = 'users';

  /**
   *Creates an instance of UserService.
   * @param {ApiService} _apiSvc
   * @memberof UserService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }

  /**
   *
   *
   * @param {IUser} row
   * @returns {Observable<IUser>}
   * @memberof UserService
   */
  public password$(row: IUser): Observable<IUser> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/${row.id}/password`;
    return this._apiSvc.patch<IUser>(url, row).pipe(take(1));
  }
}
