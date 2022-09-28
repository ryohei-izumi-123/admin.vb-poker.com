import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NEVER as NEVER$,
  timer as timer$,
  Subscription,
  Observable,
} from 'rxjs';
import {
  take,
  catchError,
  finalize,
  distinctUntilChanged,
  filter,
  skipWhile,
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { IAuthParam } from '@shared/interfaces';
import { AuthService } from '@shared/services';
import { TotpFormComponent } from '@shared/components/totp-form/totp-form.component';
import { BaseFormComponent } from '@core/class/base-form.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { _ } from '@core/class/util';

/**
 *
 *
 * @export
 * @class LoginFormComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent
  extends BaseFormComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {EventEmitter<string>}
   * @memberof LoginFormComponent
   */
  public verified$: EventEmitter<string> = new EventEmitter();

  /**
   *
   *
   * @type {Observable<string>}
   * @memberof LoginFormComponent
   */
  public isHuman$: Observable<string> = this.verified$.asObservable().pipe(
    skipWhile((token: string) => _.isEmpty(token)),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @type {TotpFormComponent}
   * @memberof LoginFormComponent
   */
  @ViewChild('$totpForm')
  public $totpForm: TotpFormComponent;

  /**
   *
   *
   * @type {ModalComponent}
   * @memberof LoginFormComponent
   */
  @ViewChild('$modal')
  public $modal: ModalComponent;

  /**
   * Creates an instance of LoginFormComponent.
   * @param {TranslateService} _translateSvc
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LoginFormComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    private _authSvc: AuthService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof LoginFormComponent
   */
  public ngOnDestroy() {
    this.verified$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @memberof LoginFormComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      username: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ])
      ),
      password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
        ])
      ),
      remember: new FormControl(false, Validators.compose([])),
    });

    this.form.disable();
    this._waitForReady$();
  }

  /**
   *
   *
   * @private
   * @memberof LoginFormComponent
   */
  private _restoreForm(): void {
    const {
      username,
      password,
      remember,
    }: IAuthParam = this._authSvc.restoreCredentials();
    if (remember) {
      this.getFormCtrl('username').setValue(username);
      this.getFormCtrl('password').setValue(password);
      this.getFormCtrl('remember').setValue(remember);
    }
  }

  /**
   *
   *
   * @private
   * @return {Subscription}
   * @memberof LoginFormComponent
   */
  private _waitForReady$(): Subscription {
    return this._subscription.add(
      this.isHuman$.pipe(take(1)).subscribe(() => {
        this.form.enable();
        this._restoreForm();
      })
    );
  }

  /**
   *
   *
   * @returns {Subscription}
   * @memberof LoginFormComponent
   */
  public onSubmit(): Subscription {
    const payload: IAuthParam = this.form.value as IAuthParam;
    const isValid: boolean = this.form.valid;
    const isBusy: boolean = this.isBusy;
    if (!isValid || isBusy) {
      return this._subscription.add(NEVER$.subscribe());
    }

    this.isBusy = true;
    this.error = null;
    this.$submit.setLoading();

    return this._subscription.add(
      this._authSvc
        .attempt$(payload)
        .pipe(
          finalize(() => (this.isBusy = false)),
          catchError((error: Error) => {
            this.error = new Error(this.translate('errors.loginFailed'));
            this.$submit.setError();

            return NEVER$;
          }),
          take(1)
        )
        .subscribe((response: boolean) => {
          this.$submit.setDefault();
          if (!response) {
            this.$modal.open();
            this.$totpForm.setFocus();
            this._setTimeoutTimer();
          }
        })
    );
  }

  /**
   *
   *
   * @private
   * @return {Subscription}
   * @memberof LoginFormComponent
   */
  private _setTimeoutTimer(): Subscription {
    const timeout: number = 60 * 2 * 1000;
    return this._subscription.add(
      timer$(timeout)
        .pipe(
          filter(() => this.$modal.isOpen),
          take(1)
        )
        .subscribe(() => {
          this.$modal.close();
          this.error = new Error(this.translate('errors.totpTimeout'));
        })
    );
  }

  /**
   *
   *
   * @param {boolean} $event
   * @memberof LoginFormComponent
   */
  public onTokenValidated($event: boolean): void {
    this.$modal.close();
  }
}
