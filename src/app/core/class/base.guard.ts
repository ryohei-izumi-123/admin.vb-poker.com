import { Injectable } from '@angular/core';
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
import {
  Observable,
  from as fromPromise$,
  NEVER as NEVER$,
  of as of$,
} from 'rxjs';
import { take, catchError, concatMap } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @abstract
 * @class BaseGuard
 * @implements {CanActivate}
 * @implements {CanActivateChild}
 * @implements {CanLoad}
 * @template T
 */
@Injectable({
  providedIn: null,
})
export abstract class BaseGuard
  implements CanActivate, CanActivateChild, CanLoad {
  /**
   *Creates an instance of BaseGuard.
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @memberof BaseGuard
   */
  public constructor(
    protected _router: Router,
    protected _route: ActivatedRoute
  ) {}

  /**
   *
   *
   * @abstract
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @return {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof BaseGuard
   */
  public abstract canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean;

  /**
   *
   *
   * @abstract
   * @param {ActivatedRouteSnapshot} childRoute
   * @param {RouterStateSnapshot} state
   * @return {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof BaseGuard
   */
  public abstract canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean;

  /**
   *
   *
   * @abstract
   * @param {Route} route
   * @param {UrlSegment[]} segments
   * @return {(Observable<boolean> | Promise<boolean> | boolean)}
   * @memberof BaseGuard
   */
  public abstract canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean;

  /**
   *
   *
   * @protected
   * @param {any[]} [commands=['/login']]
   * @return {Observable<boolean>}
   * @memberof BaseGuard
   */
  protected _redirectTo$(commands: any[] = ['/login']): Observable<boolean> {
    return fromPromise$(this._router.navigate(commands))
      .pipe(
        catchError(() => NEVER$),
        take(1)
      )
      .pipe(concatMap(() => of$(false)));
  }
}
