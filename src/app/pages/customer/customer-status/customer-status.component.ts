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
import { ICustomer } from '@shared/interfaces';
import { CustomerService, ToasterService } from '@shared/services';
import { BaseStatusComponent } from '@core/class/base-status.component';
/**
 *
 *
 * @export
 * @class CustomerStatusComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-customer-status',
  templateUrl: './customer-status.component.html',
  styleUrls: ['./customer-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerStatusComponent
  extends BaseStatusComponent<ICustomer, CustomerService>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Creates an instance of CustomerStatusComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {CustomerService} _customerSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CustomerStatusComponent
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
   * @memberof CustomerStatusComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      username: new FormControl(
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
