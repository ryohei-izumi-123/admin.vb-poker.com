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
import { IUser } from '@shared/interfaces';
import { UserService, ToasterService } from '@shared/services';
import { BaseDeleteComponent } from '@core/class/base-delete.component';

/**
 *
 *
 * @export
 * @class UserDeleteComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeleteComponent
  extends BaseDeleteComponent<IUser, UserService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of UserDeleteComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {UserService} _userSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof UserDeleteComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _userSvc: UserService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _userSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof UserDeleteComponent
   */
  public initForm(): void {
    this.form = new FormGroup({});
  }
}
