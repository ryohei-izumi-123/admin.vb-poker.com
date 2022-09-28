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
import { TranslateService } from '@ngx-translate/core';
import { ICustomer } from '@shared/interfaces';
import { CustomerService, ToasterService } from '@shared/services';
import { BasePasswordComponent } from '@core/class/base-password.component';
/**
 *
 *
 * @export
 * @class CustomerPasswordComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-customer-password',
  templateUrl: './customer-password.component.html',
  styleUrls: ['./customer-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerPasswordComponent
  extends BasePasswordComponent<ICustomer, CustomerService>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Creates an instance of CustomerPasswordComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {CustomerService} _customerSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CustomerPasswordComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _customerSvc: CustomerService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _customerSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }
}
