import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { OrderService } from '@shared/services/order.service';
import { IOrder } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class OrderResolver
 * @extends {BaseEntityResolver<IOrder, OrderService>}
 * @implements {Resolve<IOrder>}
 */
@Injectable({
  providedIn: 'root',
})
export class OrderResolver
  extends BaseEntityResolver<IOrder, OrderService>
  implements Resolve<IOrder> {
  /**
   *Creates an instance of OrderResolver.
   * @param {OrderService} _orderSvc
   * @param {Router} _router
   * @memberof OrderResolver
   */
  public constructor(
    protected _orderSvc: OrderService,
    protected _router: Router
  ) {
    super(_orderSvc, _router);
  }
}
