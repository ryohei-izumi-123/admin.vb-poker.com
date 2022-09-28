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
// import { IAuth } from '@shared/interfaces/auth';
import { BaseResolver } from '@core/class/base.resolver';

/**
 *
 *
 * @export
 * @class AuthResolver
 * @extends {BaseResolver<boolean>}
 * @implements {Resolve<boolean>}
 */ @Injectable({
  providedIn: 'root',
})
export class AuthResolver
  extends BaseResolver<boolean>
  implements Resolve<boolean> {
  /**
   * Creates an instance of AuthResolver.
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @memberof AuthResolver
   */
  public constructor(private _authSvc: AuthService, protected _router: Router) {
    super(_router);
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<boolean>}
   * @memberof AuthResolver
   */
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._authSvc.isAuthenticated$.pipe(take(1));
  }
}
