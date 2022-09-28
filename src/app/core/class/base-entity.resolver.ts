import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
  Params as RouteParams,
} from '@angular/router';
import { Observable, NEVER as NEVER$ } from 'rxjs';
import { take } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { IEntity } from '@shared/interfaces/entity';
import { BaseRestService } from '@core/class/base-rest.service';
import { BaseResolver } from '@core/class/base.resolver';

/**
 *
 *
 * @export
 * @abstract
 * @class BaseEntityResolver
 * @implements {Resolve<T>}
 * @template T
 * @template P
 */
@Injectable({
  providedIn: null,
})
export abstract class BaseEntityResolver<
    T extends IEntity,
    P extends BaseRestService<T>
  >
  extends BaseResolver<T>
  implements Resolve<T> {
  /**
   * Creates an instance of BaseEntityResolver.
   * @param {P} _restSvc
   * @param {Router} _router
   * @memberof BaseEntityResolver
   */
  public constructor(
    @Inject(BaseRestService) protected _restSvc: P,
    protected _router: Router
  ) {
    super(_router);
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<T>}
   * @memberof BaseEntityResolver
   */
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<T> {
    const params: RouteParams = route.params;
    const id: number = _.get(params, 'id');
    if (id) {
      return this._restSvc.getById$(id).pipe(take(1));
    }

    return NEVER$.pipe(take(1));
  }
}
