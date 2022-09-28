import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { ICustomer } from '@shared/interfaces';
import { CsvService, CustomerService } from '@shared/services';
import { CustomerStatusComponent } from '@pages/customer/customer-status/customer-status.component';
import { CustomerPasswordComponent } from '@pages/customer/customer-password/customer-password.component';
import { BaseListComponent } from '@core/class/base-list.component';
import { RoleComparator } from '@core/comparators/role';

/**
 *
 *
 * @export
 * @class CustomerListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerListComponent
  extends BaseListComponent<ICustomer, CustomerService, CustomerStatusComponent>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {RoleComparator}
   * @memberof CustomerListComponent
   */
  public roleComparator: RoleComparator = new RoleComparator();

  /**
   *
   *
   * @type {CustomerPasswordComponent}
   * @memberof CustomerListComponent
   */
  @ViewChild('$passwordForm')
  public $passwordForm: CustomerPasswordComponent;

  /**
   * Creates an instance of CustomerListComponent.
   * @param {TranslateService} _translateSvc
   * @param {CustomerService} _customerSvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CustomerListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _customerSvc: CustomerService,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _customerSvc, _csvSvc, _router, _changeDetectorRef);
  }

  /**
   *
   * @returns {ICustomer[]}
   * @memberof CustomerListComponent
   */
  public exportAsCsv(): ICustomer[] {
    const filename: string = `download-${this.pageName}`;
    const data: ICustomer[] = _.cloneDeep(this.rows).map((row: ICustomer) => {
      return {
        id: row.id,
        role: row.role,
        username: row.username,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        phone: row.phone,
        countryName: row.country.name,
        status: row.status,
      };
    });

    return this._csvSvc.generate<ICustomer>(data, filename);
  }
}
