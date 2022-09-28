import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  UrlSegment,
  CanLoad,
  Router,
  Route,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of as of$ } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { AuthService } from '@shared/services/auth.service';
import { IUser } from '@shared/interfaces';
import { BaseGuard } from '@core/class/base.guard';

/**
 *
 *
 * @export
 * @class AuthGuard
 * @extends {BaseGuard}
 * @implements {CanActivate}
 * @implements {CanActivateChild}
 * @implements {CanLoad}
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard
  extends BaseGuard
  implements CanActivate, CanActivateChild, CanLoad {
  /**
   *Creates an instance of AuthGuard.
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @memberof AuthGuard
   */
  public constructor(
    @Inject(AuthService) private _authSvc: AuthService,
    protected _router: Router,
    protected _route: ActivatedRoute
  ) {
    super(_router, _route);
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean>|Promise<boolean>|boolean)}
   * @memberof AuthGuard
   */
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._activate();
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} childRoute
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean>|Promise<boolean>|boolean)}
   * @memberof AuthGuard
   */
  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._activate();
  }

  /**
   *
   *
   * @param {Route} route
   * @param {UrlSegment[]} segments
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof AuthGuard
   */
  public canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  /**
   *
   *
   * @private
   * @return {Observable<boolean>}
   * @memberof AuthGuard
   */
  private _activate(): Observable<boolean> {
    return this._authSvc.getUser$().pipe(
      concatMap((user: IUser) => {
        if (_.isEmpty(user)) {
          return this._redirectTo$();
        }

        return of$(true);
      })
    );
  }
}
