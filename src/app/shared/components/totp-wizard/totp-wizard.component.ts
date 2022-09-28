import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, throwError as throwError$ } from 'rxjs';
import {
  take,
  catchError,
  finalize,
  map,
  tap,
  filter,
  distinctUntilChanged,
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '@core/class/util';
import { IAuthQr } from '@shared/interfaces';
import { AuthService, DeviceDetectorService } from '@shared/services';
import { TotpFormComponent } from '@shared/components/totp-form/totp-form.component';
import { BaseWizardComponent } from '@core/class/base-wizard.component';
import { ClrWizardPage } from '@clr/angular';

/**
 *
 *
 * @export
 * @class TotpWizardComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-totp-wizard',
  templateUrl: './totp-wizard.component.html',
  styleUrls: ['./totp-wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotpWizardComponent
  extends BaseWizardComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof TotpWizardComponent
   */
  public get size(): string {
    return this._deviceDetectorSvc.isDesktop ? 'lg' : 'md';
  }

  /**
   *
   *
   * @type {ClrWizardPage}
   * @memberof TotpWizardComponent
   */
  @ViewChild('$mainPage')
  public $mainPage: ClrWizardPage;

  /**
   *
   *
   * @type {TotpFormComponent}
   * @memberof TotpWizardComponent
   */
  @ViewChild('$totpForm')
  public $totpForm: TotpFormComponent;

  /**
   *
   *
   * @protected
   * @type {boolean}
   * @memberof TotpWizardComponent
   */
  protected _enable: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof TotpWizardComponent
   */
  public get enable(): boolean {
    return this._enable;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof TotpWizardComponent
   */
  public set enable(enable: boolean) {
    this._enable = enable;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof TotpWizardComponent
   */
  private _qr: string = null;

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof TotpWizardComponent
   */
  public get qr(): string {
    return this._qr;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof TotpWizardComponent
   */
  public set qr(qr: string) {
    this._qr = qr;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof TotpWizardComponent
   */
  @Output()
  public done$: EventEmitter<boolean> = new EventEmitter();

  /**
   * Creates an instance of TotpWizardComponent.
   * @param {TranslateService} _translateSvc
   * @param {DeviceDetectorService} _deviceDetectorSvc
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof TotpWizardComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    private _deviceDetectorSvc: DeviceDetectorService,
    private _authSvc: AuthService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof TotpWizardComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._authSvc.hasSecurity$
        .pipe(
          distinctUntilChanged(),
          tap((enable: boolean) => (this.enable = enable)),
          filter((enable: boolean) => !enable)
        )
        .subscribe(() => this.loadQrCode())
    );
  }

  /**
   *
   *
   * @memberof TotpWizardComponent
   */
  public ngOnDestroy() {
    this.done$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof TotpWizardComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @return {Subscription}
   * @memberof TotpWizardComponent
   */
  public loadQrCode(): Subscription {
    this.isBusy = true;

    return this._subscription.add(
      this._authSvc
        .getQrCode$()
        .pipe(
          map((response: IAuthQr) => response.qr),
          finalize(() => (this.isBusy = false)),
          catchError(() =>
            throwError$(new Error(this.translate('errors.unknownError')))
          ),
          take(1)
        )
        .subscribe((qr: string) => (this.qr = qr))
    );
  }

  /**
   *
   * @description formの子コンポーネントの完了イベントハンドラ。ウィザードを次へ進めます。
   * @param {boolean} $event
   * @memberof TotpWizardComponent
   */
  public onTokenValidated($event: boolean): void {
    this.$mainPage.hasError = false;
    this.$mainPage.completed = true;
    this.$wizard.navService.updateNavigation();
    this.$wizard.forceNext();
    this._changeDetectorRef.detectChanges();
  }

  /**
   *
   *
   * @param {Error} $event
   * @memberof TotpWizardComponent
   */
  public onTokenFailed($event: Error) {
    const isError: boolean = _.isError($event);
    if (isError) {
      this.$mainPage.hasError = isError;
      this.$mainPage.completed = !isError;
      this._changeDetectorRef.detectChanges();
    }
  }

  /**
   *
   * @description formの子コンポーネントのサブミットをウィザードカスタムイベントから呼び出します。
   * @return {Subscription}
   * @memberof TotpWizardComponent
   */

  public onPageCommit(): Subscription {
    return this.$totpForm.onSubmit();
  }

  /**
   *
   *
   * @memberof TotpWizardComponent
   */
  public onPageCancel(): void {
    this.close();
    this.onCancel();
  }

  /**
   *
   *
   * @memberof TotpWizardComponent
   */
  public onCancel(): void {
    super.onCancel();
    this.$totpForm.reset();
  }

  /**
   *
   *
   * @memberof TotpWizardComponent
   */
  public onFinish(): void {
    super.onFinish();
    this.$totpForm.reset();
  }

  /**
   *
   *
   * @param {string} [type='header']
   * @param {string} [action='index']
   * @return {string}
   * @memberof TotpWizardComponent
   */
  public getPageText(
    type: string = 'header',
    action: string = 'index'
  ): string {
    const resource: string = 'totp';
    return this.translate(`pages.${resource}.${action}.${type}`);
  }
}
