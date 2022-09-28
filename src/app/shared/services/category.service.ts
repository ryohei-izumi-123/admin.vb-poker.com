import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { ICategory } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class CategoryService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryService
  extends BaseRestService<ICategory>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof CategoryService
   */
  public endpoint: string = 'categories';

  /**
   *Creates an instance of CategoryService.
   * @param {ApiService} _apiSvc
   * @memberof CategoryService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }
}
