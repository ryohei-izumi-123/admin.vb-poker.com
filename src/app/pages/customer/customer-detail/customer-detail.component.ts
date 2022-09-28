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
import { ICustomer } from '@shared/interfaces';
import { CustomerService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class CustomerDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDetailComponent
  extends BaseDetailComponent<ICustomer, CustomerService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of CustomerDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {CustomerService} _customerSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CustomerDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _customerSvc: CustomerService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _customerSvc, _router, _route, _changeDetectorRef);
  }
}
