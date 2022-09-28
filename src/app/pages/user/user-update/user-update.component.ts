import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Validators,
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of as of$, EMPTY as EMPTY$, Subscription } from 'rxjs';
import { take, distinctUntilChanged, map } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { AppValidator } from '@core/class/app-validator';
import { IOption, IUser, ICountry } from '@shared/interfaces';
import {
  UserService,
  OptionService,
  ValidateService,
  ToasterService,
} from '@shared/services';
import { BaseUpdateComponent } from '@core/class/base-update.component';
import { TUserRole } from '@shared/types';

/**
 *
 *
 * @export
 * @class UserUpdateComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserUpdateComponent
  extends BaseUpdateComponent<IUser, UserService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof UserUpdateComponent
   */
  private _showPasswordField: boolean = true;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof UserUpdateComponent
   */
  public get showPasswordField(): boolean {
    return this._showPasswordField;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof UserUpdateComponent
   */
  public set showPasswordField(showPasswordField: boolean) {
    this._showPasswordField = showPasswordField;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof UserUpdateComponent
   */
  protected _modelName: string = 'users';

  /**
   *
   *
   * @type {ICountry[]}
   * @memberof UserUpdateComponent
   */
  public countries: ICountry[] = [];

  /**
   *
   *
   * @type {TUserRole[]}
   * @memberof UserUpdateComponent
   */
  public roles: TUserRole[] = ['administrator', 'manager', 'operator'];

  /**
   * Creates an instance of UserUpdateComponent.
   * @param {TranslateService} _translateSvc
   * @param {ValidateService} _validateSvc
   * @param {ToasterService} _toasterSvc
   * @param {OptionService} _optionSvc
   * @param {UserService} _userSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof UserUpdateComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _validateSvc: ValidateService,
    protected _toasterSvc: ToasterService,
    protected _optionSvc: OptionService,
    protected _userSvc: UserService,
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _validateSvc,
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
   * @memberof UserUpdateComponent
   */
  public ngOnInit() {
    this.initCountries();
    super.ngOnInit();
  }

  /**
   *
   *
   * @memberof UserUpdateComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      role: new FormControl(
        'operator',
        Validators.compose([Validators.required])
      ),
      username: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ])
      ),
      changePassword: new FormControl(null, Validators.compose([])),
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
      firstName: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(16),
        ])
      ),
      lastName: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(16),
        ])
      ),
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(4),
          Validators.maxLength(256),
        ])
      ),
      countryId: new FormControl('', Validators.compose([Validators.required])),
      phone: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          AppValidator.isNumber,
        ])
      ),
      status: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.setAsyncValidators();

    this._subscription.add(
      this.getFormCtrl('changePassword')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value: boolean) => {
          this.showPasswordField = value;
          this._togglePasswordCtrl(value);
        })
    );

    if (this.hasRouteParamsId) {
      this.showPasswordField = false;
      this.getFormCtrl('changePassword').patchValue(false);
    }
  }

  /**
   *
   *
   * @protected
   * @memberof UserUpdateComponent
   */
  protected setAsyncValidators(): void {
    this.validateUsername$();
    this.validateEmail$();
    this.validatePhone$();
    this.validateConfirmPassword$();
  }

  /**
   *
   *
   * @memberof UserUpdateComponent
   */
  public validateUsername$(): void {
    const ctrl: AbstractControl = this.getFormCtrl('username');
    const validators = [this.validateIsUnique$('username')];

    this.resetAsyncValidator(ctrl);
    this.setAsyncValidator(ctrl, validators);
  }

  /**
   *
   *
   * @memberof UserUpdateComponent
   */
  public validateEmail$(): void {
    const ctrl: AbstractControl = this.getFormCtrl('email');
    const validators = [this.validateIsUnique$('email')];

    this.resetAsyncValidator(ctrl);
    this.setAsyncValidator(ctrl, validators);
  }

  /**
   *
   *
   * @memberof UserUpdateComponent
   */
  public validatePhone$(): void {
    const ctrl: AbstractControl = this.getFormCtrl('phone');
    const validators = [this.validateIsUnique$('phone')];

    this.resetAsyncValidator(ctrl);
    this.setAsyncValidator(ctrl, validators);
  }

  /**
   *
   *
   * @memberof UserUpdateComponent
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
   * @memberof UserUpdateComponent
   */
  public validateSamePassword$ = (
    compareWith: AbstractControl
  ): AsyncValidatorFn => {
    return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
      const error: ValidationErrors = { isSamePassword: true };
      if (ctrl.disabled || ctrl.pristine || _.isEmpty(ctrl.value)) {
        return of$(null);
      }

      if (!compareWith) {
        return EMPTY$;
      }

      return of$(ctrl.value === compareWith.value ? null : error);
    };
  };

  /**
   *
   *
   * @private
   * @return {Subscription}
   * @memberof UserUpdateComponent
   */
  private initCountries(): Subscription {
    return this._subscription.add(
      this._optionSvc.option$
        .pipe(
          map((option: IOption) => option.countries),
          take(1)
        )
        .subscribe((data: ICountry[]) => {
          this.countries = data;
          this._changeDetectorRef.markForCheck();
        })
    );
  }

  /**
   *
   *
   * @protected
   * @param {FormGroup} [form=this.form]
   * @param {string} [parent=undefined]
   * @param {(keyof IUser)[]} [ignore=[]]
   * @return {void}
   * @memberof UserUpdateComponent
   */
  protected pluckRowDataToFormControl(
    form: FormGroup = this.form,
    parent: string = undefined,
    ignore: (keyof IUser)[] = []
  ): void {
    return super.pluckRowDataToFormControl(form, parent, ['password']);
  }

  /**
   *
   *
   * @private
   * @param {boolean} [enable=false]
   * @return {void}
   * @memberof UserUpdateComponent
   */
  private _togglePasswordCtrl(enable: boolean = false): void {
    const fields: string[] = ['password', 'confirmPassword'];
    fields.map((field: string) => this.toggleCtrl(field, enable));
    this.form.updateValueAndValidity();
  }

  /**
   *
   *
   * @protected
   * @returns {Observable<IUser>}
   * @memberof UserUpdateComponent
   */
  protected update$(): Observable<IUser> {
    const payload: IUser = this.form.value as IUser;
    if (this.hasRouteParamsId) {
      _.set(payload, 'id', this.row.id);
      const changePassword: boolean = this.getFormCtrl('changePassword').value;
      if (!changePassword) {
        _.set(payload, 'password', this.row.password);
      }

      return this._userSvc.update$(payload).pipe(take(1));
    }

    return this._userSvc.create$(payload).pipe(take(1));
  }
}
