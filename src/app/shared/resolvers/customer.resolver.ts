import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { CustomerService } from '@shared/services/customer.service';
import { ICustomer } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class CustomerResolver
 * @extends {BaseEntityResolver<ICustomer, CustomerService>}
 * @implements {Resolve<ICustomer>}
 */
@Injectable({
  providedIn: 'root',
})
export class CustomerResolver
  extends BaseEntityResolver<ICustomer, CustomerService>
  implements Resolve<ICustomer> {
  /**
   *Creates an instance of CustomerResolver.
   * @param {CustomerService} _customerSvc
   * @param {Router} _router
   * @memberof CustomerResolver
   */
  public constructor(
    protected _customerSvc: CustomerService,
    protected _router: Router
  ) {
    super(_customerSvc, _router);
  }
}
