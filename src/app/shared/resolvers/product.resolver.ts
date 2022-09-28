import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { ProductService } from '@shared/services/product.service';
import { IProduct } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class ProductResolver
 * @extends {BaseEntityResolver<IProduct, ProductService>}
 * @implements {Resolve<IProduct>}
 */
@Injectable({
  providedIn: 'root',
})
export class ProductResolver
  extends BaseEntityResolver<IProduct, ProductService>
  implements Resolve<IProduct> {
  /**
   *Creates an instance of ProductResolver.
   * @param {ProductService} _productSvc
   * @param {Router} _router
   * @memberof ProductResolver
   */
  public constructor(
    protected _productSvc: ProductService,
    protected _router: Router
  ) {
    super(_productSvc, _router);
  }
}
