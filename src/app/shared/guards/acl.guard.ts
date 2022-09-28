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
import { concatMap, skipWhile, take } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { AuthService } from '@shared/services/auth.service';
import { AclService } from '@shared/services/acl.service';
import { IAcl, IUser } from '@shared/interfaces';
import { BaseGuard } from '@core/class/base.guard';

/**
 *
 *
 * @export
 * @class AclGuard
 * @extends {BaseGuard}
 * @implements {CanActivate}
 * @implements {CanActivateChild}
 * @implements {CanLoad}
 */
@Injectable({
  providedIn: 'root',
})
export class AclGuard
  extends BaseGuard
  implements CanActivate, CanActivateChild, CanLoad {
  /**
   * Creates an instance of AclGuard.
   * @param {AuthService} _authSvc
   * @param {AclService} _aclSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @memberof AclGuard
   */
  public constructor(
    @Inject(AuthService) private _authSvc: AuthService,
    @Inject(AclService) private _aclSvc: AclService,
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
   * @memberof AclGuard
   */
  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._validate(state);
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} childRoute
   * @param {RouterStateSnapshot} state
   * @returns {(Observable<boolean>|Promise<boolean>|boolean)}
   * @memberof AclGuard
   */
  public canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this._validate(state);
  }

  /**
   *
   *
   * @param {Route} route
   * @param {UrlSegment[]} segments
   * @returns {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof AclGuard
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
   * @memberof AclGuard
   */
  private _validate(state: RouterStateSnapshot): Observable<boolean> {
    return this._authSvc.user$.pipe(
      skipWhile((user: IUser) => _.isEmpty(user)),
      concatMap((user: IUser) => {
        const acl: IAcl = _.get(user, 'acl');
        const url: string = _.get(state, 'url');
        const valid: boolean = this._aclSvc.checkPermissionByUrl(acl, url);
        if (!valid) {
          return this._redirectTo$(['/error']);
        }

        return of$(valid);
      }),
      take(1)
    );
  }
}
