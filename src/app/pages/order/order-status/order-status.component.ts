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
import { IOrder } from '@shared/interfaces';
import { OrderService, ToasterService } from '@shared/services';
import { BaseStatusComponent } from '@core/class/base-status.component';
/**
 *
 *
 * @export
 * @class OrderStatusComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatusComponent
  extends BaseStatusComponent<IOrder, OrderService>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Creates an instance of OrderStatusComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {OrderService} _orderSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof OrderStatusComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _orderSvc: OrderService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _orderSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }
  /**
   *
   *
   * @memberof OrderStatusComponent
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
