import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY as EMPTY$ } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { ToasterService, AuthService } from '@shared/services';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class LogoutComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   * Creates an instance of LogoutComponent.
   * @param {ToasterService} _toasterSvc
   * @param {AuthService} _authSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LogoutComponent
   */
  public constructor(
    private _toasterSvc: ToasterService,
    private _authSvc: AuthService,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof LogoutComponent
   */
  public ngOnInit() {
    this._toasterSvc.clearAll();
    this._subscription.add(
      this._authSvc
        .signOut$()
        .pipe(
          catchError(() => EMPTY$),
          take(1)
        )
        .subscribe()
    );
  }
}
