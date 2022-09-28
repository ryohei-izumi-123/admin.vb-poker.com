import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { IProduct } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class ProductService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService
  extends BaseRestService<IProduct>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof ProductService
   */
  public endpoint: string = 'products';

  /**
   *Creates an instance of ProductService.
   * @param {ApiService} _apiSvc
   * @memberof ProductService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }
}
