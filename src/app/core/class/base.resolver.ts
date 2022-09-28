import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

/**
 *
 *
 * @export
 * @abstract
 * @class BaseResolver
 * @implements {Resolve<T>}
 * @template T
 */
@Injectable({
  providedIn: null,
})
export abstract class BaseResolver<T> implements Resolve<T> {
  /**
   * Creates an instance of BaseResolver.
   * @param {Router} _router
   * @memberof BaseResolver
   */
  public constructor(protected _router: Router) {}

  /**
   *
   *
   * @abstract
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @return {Observable<T>}
   * @memberof BaseResolver
   */
  public abstract resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<T>;
}
