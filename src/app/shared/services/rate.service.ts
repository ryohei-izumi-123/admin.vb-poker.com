import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { IRate } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class RateService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class RateService extends BaseRestService<IRate> implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof RateService
   */
  public endpoint: string = 'rates';

  /**
   *Creates an instance of RateService.
   * @param {ApiService} _apiSvc
   * @memberof RateService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }
}
