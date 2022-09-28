import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import {
  Observable,
  Subscription,
  NEVER as NEVER$,
  EMPTY as EMPTY$,
  of as of$,
} from 'rxjs';
import {
  catchError,
  take,
  finalize,
  distinctUntilChanged,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { IEntity } from '@shared/interfaces';
import { ToasterService } from '@shared/services';
import { BaseRestService } from '@core/class/base-rest.service';
import { BaseStatusComponent } from '@core/class/base-status.component';

/**
 *
 *
 * @export
 * @class BasePasswordComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-password',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BasePasswordComponent<
    T extends IEntity,
    P extends BaseRestService<T>
  >
  extends BaseStatusComponent<T, P>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Creates an instance of BasePasswordComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {BaseRestService<T>} _restSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BasePasswordComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _restSvc: BaseRestService<T>,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _restSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @protected
   * @param {FormGroup} [form=this.form]
   * @param {string} [parent=undefined]
   * @param {(keyof T)[]} [ignore=[]]
   * @memberof BasePasswordComponent
   */
  protected pluckRowDataToFormControl(
    form: FormGroup = this.form,
    parent: string = undefined,
    ignore: (keyof T)[] = ['password', 'confirmPassword']
  ): void {
    this.getFormCtrlFields(form)
      .filter((field: keyof T) => !ignore.includes(field))
      .map((field: keyof T) => {
        const ctrl: AbstractControl = _.get(form, `controls.${field}`);
        if (!!!_.isEmpty(ctrl)) {
          if (ctrl instanceof FormGroup) {
            return this.pluckRowDataToFormControl(ctrl, `${field}`);
          }

          const value: string = parent
            ? _.get(this.row, `${parent}.${field}`)
            : _.get(this.row, field);
          const isValid: boolean =
            !!!_.isNull(value) && !!!_.isUndefined(value);
          if (isValid) {
            ctrl.patchValue(value);
          }
        }
      });
  }

  /**
   *
   *
   * @memberof BasePasswordComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      username: new FormControl(
        { value: '', disabled: true },
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
      confirmPassword: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
        ])
      ),
    });

    this.setAsyncValidators();
  }

  /**
   *
   *
   * @readonly
   * @protected
   * @type {T}
   * @memberof BasePasswordComponent
   */
  protected get formatFormValue(): T {
    const payload: T = this.form.value as T;
    return payload;
  }

  /**
   *
   *
   * @protected
   * @returns {Observable<T>}
   * @memberof BasePasswordComponent
   */
  protected password$(): Observable<T> {
    const payload: T = this.formatFormValue;
    _.set(payload, 'id', this.row.id);

    return this._restSvc.password$(payload).pipe(take(1));
  }

  /**
   *
   *
   * @returns {Subscription}
   * @memberof BasePasswordComponent
   */
  public onSubmit(): Subscription {
    const isValid: boolean = this.form.valid;
    const isBusy: boolean = this.isBusy;
    if (!isValid || isBusy) {
      return this._subscription.add(NEVER$.subscribe());
    }

    this.isBusy = true;
    this.error = null;

    return this._subscription.add(
      this.password$()
        .pipe(
          finalize(() => (this.isBusy = false)),
          catchError((error: Error) => {
            this.error = new Error(this.translate('errors.updateFailed'));

            return NEVER$;
          }),
          take(1)
        )
        .subscribe((response: T) => {
          this.reset();
          this._toasterSvc.show({
            type: 'success',
            message: this.translate('errors.updateSuccess'),
          });
          this.afterUpdated$.emit(true);

          return this._subscription.add(EMPTY$.subscribe());
        })
    );
  }

  /**
   *
   *
   * @protected
   * @memberof BasePasswordComponent
   */
  protected setAsyncValidators(): void {
    this.validateConfirmPassword$();
  }

  /**
   *
   *
   * @memberof BasePasswordComponent
   */
  public validateConfirmPassword$(): void {
    const ctrl: AbstractControl = this.getFormCtrl('confirmPassword');
    const compareWith: AbstractControl = this.getFormCtrl('password');
    const validators = [this.validateSamePassword$(compareWith)];

    this.resetAsyncValidator(ctrl);
    this.setAsyncValidator(ctrl, validators);

    this._subscription.add(
      compareWith.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(() => ctrl.updateValueAndValidity())
    );
  }

  /**
   *
   *
   * @param {AbstractControl} compareWith
   * @memberof BasePasswordComponent
   */
  public validateSamePassword$ = (
    compareWith: AbstractControl
  ): AsyncValidatorFn => {
    return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
      const error: ValidationErrors = { isSamePassword: true };
      if (ctrl.disabled) {
        return of$(null);
      }

      if (!ctrl.value || !compareWith) {
        return EMPTY$;
      }

      return of$(ctrl.value === compareWith.value ? null : error);
    };
  };
}
