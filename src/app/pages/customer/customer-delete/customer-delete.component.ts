import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ICustomer } from '@shared/interfaces';
import { CustomerService, ToasterService } from '@shared/services';
import { BaseDeleteComponent } from '@core/class/base-delete.component';

/**
 *
 *
 * @export
 * @class CustomerDeleteComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-customer-delete',
  templateUrl: './customer-delete.component.html',
  styleUrls: ['./customer-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDeleteComponent
  extends BaseDeleteComponent<ICustomer, CustomerService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of CustomerDeleteComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {CustomerService} _customerSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CustomerDeleteComponent
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

  /**
   *
   *
   * @memberof CustomerDeleteComponent
   */
  public initForm(): void {
    this.form = new FormGroup({});
  }
}
