import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  timer as timer$,
  NEVER as NEVER$,
  Subscription,
  Observable,
} from 'rxjs';
import { skipWhile, take, catchError, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '@core/class/util';
import { IAuth, IAuthParam, IAuthTotpParam } from '@shared/interfaces';
import { AuthService } from '@shared/services';
import { AppValidator } from '@core/class';
import { BaseFormComponent } from '@core/class/base-form.component';

/**
 *
 *
 * @export
 * @class TotpFormComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-totp-form',
  templateUrl: './totp-form.component.html',
  styleUrls: ['./totp-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotpFormComponent
  extends BaseFormComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @private
   * @type {IAuthParam}
   * @memberof TotpFormComponent
   */
  private _param: IAuthParam = null;
  /**
   *
   *
   * @type {IAuthParam}
   * @memberof TotpFormComponent
   */
  public get param(): IAuthParam {
    return this._param;
  }

  /**
   *
   *
   * @memberof TotpFormComponent
   */
  @Input()
  public set param(param: IAuthParam) {
    this._param = param;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof TotpFormComponent
   */
  @Output()
  public done$: EventEmitter<boolean> = new EventEmitter();

  /**
   *
   *
   * @type {ElementRef}
   * @memberof TotpFormComponent
   */
  @ViewChild('$token', { static: false })
  public $token: ElementRef;

  /**
   *Creates an instance of TotpFormComponent.
   * @param {TranslateService} _translateSvc
   * @param {AuthService} _authSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof TotpFormComponent
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
   * @memberof TotpFormComponent
   */
  public ngOnDestroy() {
    this.done$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof TotpFormComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   * @memberof TotpFormComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @memberof TotpFormComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      token: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          AppValidator.isNumber,
        ])
      ),
    });
  }

  /**
   *
   *
   * @returns {Subscription}
   * @memberof TotpFormComponent
   */
  public onSubmit(): Subscription {
    const token: string = this.getFormCtrl('token').value;
    const isUpdate: boolean = _.isNull(this.param);
    const param: IAuthParam = isUpdate ? {} : _.clone(this.param);
    const payload: IAuthTotpParam = _.assign(param, {
      token,
    });

    const isValid: boolean = this.form.valid;
    const isBusy: boolean = this.isBusy;
    if (!isValid || isBusy) {
      return this._subscription.add(NEVER$.subscribe());
    }

    const source$: Observable<boolean> = isUpdate
      ? this._authSvc.security$(payload)
      : this._authSvc.totp$(payload);

    this.isBusy = true;
    this.error = null;

    return this._subscription.add(
      source$
        .pipe(
          finalize(() => (this.isBusy = false)),
          catchError((error: Error) => {
            this.error = new Error(this.translate('errors.invalidToken'));
            return NEVER$;
          }),
          take(1)
        )
        .subscribe((response: boolean) => {
          this.done$.emit(response);
          this.reset();
        })
    );
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof TotpFormComponent
   */
  public setFocus(): Subscription {
    return this._subscription.add(
      timer$(100)
        .pipe(
          skipWhile(() => _.isEmpty(this.$token)),
          take(1)
        )
        .subscribe(() => this.$token.nativeElement.focus())
    );
  }
}
