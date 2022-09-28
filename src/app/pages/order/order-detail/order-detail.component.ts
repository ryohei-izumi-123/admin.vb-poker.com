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
import { IOrder } from '@shared/interfaces';
import { OrderService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class OrderDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailComponent
  extends BaseDetailComponent<IOrder, OrderService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of OrderDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {OrderService} _orderSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof OrderDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _orderSvc: OrderService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _orderSvc, _router, _route, _changeDetectorRef);
  }
}
