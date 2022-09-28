import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IProduct } from '@shared/interfaces';
import { ProductService, ToasterService } from '@shared/services';
import { BaseStatusComponent } from '@core/class/base-status.component';
/**
 *
 *
 * @export
 * @class ProductStatusComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-product-status',
  templateUrl: './product-status.component.html',
  styleUrls: ['./product-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductStatusComponent
  extends BaseStatusComponent<IProduct, ProductService>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Creates an instance of ProductStatusComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {ProductService} _productSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ProductStatusComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _productSvc: ProductService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _productSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }
  /**
   *
   *
   * @memberof ProductStatusComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ])
      ),
      status: new FormControl(null, Validators.compose([Validators.required])),
    });
  }
}
