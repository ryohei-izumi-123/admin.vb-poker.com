import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { IOrder } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class OrderService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseRestService<IOrder> implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof OrderService
   */
  public endpoint: string = 'orders';

  /**
   *Creates an instance of OrderService.
   * @param {ApiService} _apiSvc
   * @memberof OrderService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }
}
