import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { IAuth } from '@shared/interfaces';
import { AuthService, ValidateService, ToasterService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';
import { TotpWizardComponent } from '@shared/components/totp-wizard/totp-wizard.component';

/**
 *
 *
 * @export
 * @class AccountSecurityComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-account-security',
  templateUrl: './account-security.component.html',
  styleUrls: ['./account-security.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSecurityComponent
  extends BaseDetailComponent<IAuth, AuthService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {TotpWizardComponent}
   * @memberof AccountSecurityComponent
   */
  @ViewChild('$totpWizard')
  public $totpWizard: TotpWizardComponent;

  /**
   *
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof AccountSecurityComponent
   */
  public get enable$(): Observable<boolean> {
    return this._authSvc.hasSecurity$.pipe(distinctUntilChanged());
  }

  /**
   * Creates an instance of AccountSecurityComponent.
   * @param {TranslateService} _translateSvc
   * @param {ValidateService} _validateSvc
   * @param {ToasterService} _toasterSvc
   * @param {AuthService} _authSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AccountSecurityComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _validateSvc: ValidateService,
    protected _toasterSvc: ToasterService,
    protected _authSvc: AuthService,
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _authSvc, _router, _route, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof AccountSecurityComponent
   */
  public ngOnInit() {
    this._subscription.add(this.fromRouteData$().subscribe());
  }

  /**
   *
   *
   * @memberof AccountSecurityComponent
   */
  public openWizard(): void {
    this.$totpWizard.open();
  }

  /**
   *
   * @description ウィザードの完了イベント。引数がfalseの場合はキャンセル（クローズボタン押下など）。
   * @param {boolean} $event
   * @memberof AccountSecurityComponent
   */
  public onWizardComplete($event: boolean): void {
    if ($event) {
      this._authSvc.triggerFetch();
    }
  }
}
