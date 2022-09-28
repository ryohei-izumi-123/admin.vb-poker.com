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
import { IUser } from '@shared/interfaces';
import { CsvService, UserService } from '@shared/services';
import { UserStatusComponent } from '@pages/user/user-status/user-status.component';
import { UserPasswordComponent } from '@pages/user/user-password/user-password.component';
import { BaseListComponent } from '@core/class/base-list.component';
import { RoleComparator } from '@core/comparators/role';

/**
 *
 *
 * @export
 * @class UserListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent
  extends BaseListComponent<IUser, UserService, UserStatusComponent>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {RoleComparator}
   * @memberof UserListComponent
   */
  public roleComparator: RoleComparator = new RoleComparator();

  /**
   *
   *
   * @type {UserPasswordComponent}
   * @memberof UserListComponent
   */
  @ViewChild('$passwordForm')
  public $passwordForm: UserPasswordComponent;

  /**
   * Creates an instance of UserListComponent.
   * @param {TranslateService} _translateSvc
   * @param {UserService} _userSvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof UserListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _userSvc: UserService,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _userSvc, _csvSvc, _router, _changeDetectorRef);
  }

  /**
   *
   * @returns {IUser[]}
   * @memberof UserListComponent
   */
  public exportAsCsv(): IUser[] {
    const filename: string = `download-${this.pageName}`;
    const data: IUser[] = _.cloneDeep(this.rows).map((row: IUser) => {
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

    return this._csvSvc.generate<IUser>(data, filename);
  }
}
