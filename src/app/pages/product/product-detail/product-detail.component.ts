import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IProduct } from '@shared/interfaces';
import { ProductService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class ProductDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent
  extends BaseDetailComponent<IProduct, ProductService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of ProductDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {ProductService} _productSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ProductDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _productSvc: ProductService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _productSvc, _router, _route, _changeDetectorRef);
  }
}
