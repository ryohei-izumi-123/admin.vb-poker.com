import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';
import { AclService } from '@shared/services/acl.service';
import { IAcl } from '@shared/interfaces';

/**
 *
 *
 * @export
 * @class AclResolver
 * @extends {BaseEntityResolver<IAcl, AclService>}
 * @implements {Resolve<IAcl>}
 */
@Injectable({
  providedIn: 'root',
})
export class AclResolver
  extends BaseEntityResolver<IAcl, AclService>
  implements Resolve<IAcl[]> {
  /**
   * Creates an instance of AclResolver.
   * @param {AclService} _aclSvc
   * @param {Router} _router
   * @memberof AclResolver
   */
  public constructor(protected _aclSvc: AclService, protected _router: Router) {
    super(_aclSvc, _router);
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<IAcl[]>}
   * @memberof AclResolver
   */
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IAcl[]> {
    return this._aclSvc.getAll$().pipe(take(1));
  }
}
