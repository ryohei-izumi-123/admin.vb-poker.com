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
import { SettingService } from '@shared/services/setting.service';
import { ISetting } from '@shared/interfaces';

/**
 *
 *
 * @export
 * @class SettingResolver
 * @extends {BaseEntityResolver<ISetting, SettingService>}
 * @implements {Resolve<ISetting>}
 */
@Injectable({
  providedIn: 'root',
})
export class SettingResolver
  extends BaseEntityResolver<ISetting, SettingService>
  implements Resolve<ISetting> {
  /**
   * Creates an instance of SettingResolver.
   * @param {SettingService} _settingSvc
   * @param {Router} _router
   * @memberof SettingResolver
   */
  public constructor(
    protected _settingSvc: SettingService,
    protected _router: Router
  ) {
    super(_settingSvc, _router);
  }

  /**
   *
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<ISetting>}
   * @memberof SettingResolver
   */
  public resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ISetting> {
    return this._settingSvc.getSetting$().pipe(take(1));
  }
}
