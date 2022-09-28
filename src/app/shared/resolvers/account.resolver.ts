import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '@shared/services/auth.service';
import { IUser } from '@shared/interfaces/user';
import { BaseResolver } from '@core/class/base.resolver';

/**
 *
 *
 * @export
 * @class AccountResolver
 * @extends {BaseResolver<IUser>}
 * @implements {Resolve<IUser>}
 */ @Injectable({
  providedIn: 'root',
})
export class AccountResolver
  extends BaseResolver<IUser>
  implements Resolve<IUser> {
  /**
   * Creates an instance of AccountResolver.
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @memberof AccountResolver
   */
  public constructor(private _authSvc: AuthService, protected _router: Router) {
    super(_router);
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<IUser>}
   * @memberof AccountResolver
   */
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IUser> {
    return this._authSvc.getUser$().pipe(take(1));
  }
}
