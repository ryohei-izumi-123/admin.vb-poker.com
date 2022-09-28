import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { ICountry } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class CountryService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class CountryService
  extends BaseRestService<ICountry>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof CountryService
   */
  public endpoint: string = 'countries';

  /**
   *Creates an instance of CountryService.
   * @param {ApiService} _apiSvc
   * @memberof CountryService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }
}
