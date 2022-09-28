import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { IWebpage } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class WebpageService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class WebpageService
  extends BaseRestService<IWebpage>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof WebpageService
   */
  public endpoint: string = 'webpages';

  /**
   *Creates an instance of WebpageService.
   * @param {ApiService} _apiSvc
   * @memberof WebpageService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }
}
