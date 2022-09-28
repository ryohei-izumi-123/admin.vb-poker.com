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
import { IUser } from '@shared/interfaces';
import { UserService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class UserDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailComponent
  extends BaseDetailComponent<IUser, UserService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of UserDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {UserService} _userSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof UserDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _userSvc: UserService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _userSvc, _router, _route, _changeDetectorRef);
  }
}
