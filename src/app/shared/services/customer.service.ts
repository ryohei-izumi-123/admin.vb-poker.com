import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ApiService } from '@shared/services/api.service';
import { ICustomer } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class CustomerService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerService
  extends BaseRestService<ICustomer>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof CustomerService
   */
  public endpoint: string = 'customers';

  /**
   *Creates an instance of CustomerService.
   * @param {ApiService} _apiSvc
   * @memberof CustomerService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }

  /**
   *
   *
   * @param {ICustomer} row
   * @returns {Observable<ICustomer>}
   * @memberof CustomerService
   */
  public password$(row: ICustomer): Observable<ICustomer> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/${row.id}/password`;
    return this._apiSvc.patch<ICustomer>(url, row).pipe(take(1));
  }
}
