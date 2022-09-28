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
import { IAuth } from '@shared/interfaces';
import { AuthService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class AccountDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailComponent
  extends BaseDetailComponent<IAuth, AuthService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of AccountDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {AuthService} _authSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AccountDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _authSvc: AuthService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _authSvc, _router, _route, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof AccountDetailComponent
   */
  public ngOnInit() {
    this._subscription.add(this.fromRouteData$().subscribe());
  }
}
