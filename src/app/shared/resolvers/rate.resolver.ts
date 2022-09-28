import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { RateService } from '@shared/services/rate.service';
import { IRate } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class RateResolver
 * @extends {BaseEntityResolver<IRate, RateService>}
 * @implements {Resolve<IRate>}
 */
@Injectable({
  providedIn: 'root',
})
export class RateResolver
  extends BaseEntityResolver<IRate, RateService>
  implements Resolve<IRate> {
  /**
   *Creates an instance of RateResolver.
   * @param {RateService} _rateSvc
   * @param {Router} _router
   * @memberof RateResolver
   */
  public constructor(
    protected _rateSvc: RateService,
    protected _router: Router
  ) {
    super(_rateSvc, _router);
  }
}
