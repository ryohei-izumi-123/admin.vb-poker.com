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
  AbstractControl,
  Validators,
  FormControl,
  FormGroup,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of as of$, merge as merge$, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppValidator } from '@core/class/app-validator';
import { ILanguage, ILanguageSchemaValidateResult } from '@shared/interfaces';
import { TIso6391, TScope } from '@shared/types';
import {
  ImgService,
  LanguageService,
  ValidateService,
  ToasterService,
} from '@shared/services';
import { BaseUpdateComponent } from '@core/class/base-update.component';
import { _, Util } from '@core/class/util';

/**
 *
 *
 * @export
 * @class LanguageUpdateComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-language-update',
  templateUrl: './language-update.component.html',
  styleUrls: ['./language-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageUpdateComponent
  extends BaseUpdateComponent<ILanguage, LanguageService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof LanguageUpdateComponent
   */
  private _rawMode: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof LanguageUpdateComponent
   */
  public get rawMode(): boolean {
    return this._rawMode;
  }

  /**
   *
   *
   * @memberof LanguageUpdateComponent
   */
  public set rawMode(rawMode: boolean) {
    this._rawMode = rawMode;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof LanguageUpdateComponent
   */
  protected _modelName: string = 'languages';

  /**
   *
   *
   * @type {TIso6391[]}
   * @memberof LanguageUpdateComponent
   */
  public locales: TIso6391[] = ['en', 'ja'];

  /**
   *
   *
   * @type {TIso6391[]}
   * @memberof LanguageUpdateComponent
   */
  public scopes: TScope[] = ['public', 'private'];

  /**
   * Creates an instance of LanguageUpdateComponent.
   * @param {TranslateService} _translateSvc
   * @param {ValidateService} _validateSvc
   * @param {ToasterService} _toasterSvc
   * @param {ImgService} _imgSvc
   * @param {LanguageService} _languageSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LanguageUpdateComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _validateSvc: ValidateService,
    protected _toasterSvc: ToasterService,
    protected _imgSvc: ImgService,
    protected _languageSvc: LanguageService,
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _validateSvc,
      _toasterSvc,
      _languageSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof LanguageUpdateComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      scope: new FormControl(null, Validators.compose([Validators.required])),
      locale: new FormControl(null, Validators.compose([Validators.required])),
      i18N: new FormControl(
        null,
        Validators.compose([Validators.required, AppValidator.isJson])
      ),
      rawJson: new FormControl(
        null,
        Validators.compose([Validators.nullValidator])
      ),
      status: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.setAsyncValidators();
    this.subscribeOnChange();
  }

  /**
   *
   *
   * @private
   * @return {Subscription}
   * @memberof LanguageUpdateComponent
   */
  private subscribeOnChange(): Subscription {
    const i18N: AbstractControl = this.getFormCtrl('i18N');
    const rawJson: AbstractControl = this.getFormCtrl('rawJson');

    return this._subscription.add(
      merge$(
        i18N.valueChanges.pipe(
          distinctUntilChanged(),
          filter(() => this.rawMode),
          map((value: any) => Util.fromJson(value)),
          map((value: any) => ({
            ctrl: rawJson,
            value,
          }))
        ),
        rawJson.valueChanges.pipe(
          distinctUntilChanged(),
          filter(() => !this.rawMode),
          map((value: any) => Util.toJson(value)),
          map((value: any) => ({
            ctrl: i18N,
            value,
          }))
        )
      ).subscribe(({ ctrl, value }: { ctrl: AbstractControl; value: any }) => {
        ctrl.markAsDirty();
        ctrl.markAsTouched();
        ctrl.patchValue(value);
      })
    );
  }

  /**
   *
   *
   * @protected
   * @memberof LanguageUpdateComponent
   */
  protected setAsyncValidators(): void {
    this.validateI18N$();
  }

  /**
   *
   *
   * @memberof CustomerUpdateComponent
   */
  public validateI18N$(): void {
    const ctrl: AbstractControl = this.getFormCtrl('i18N');
    const validators = [this.validateJsonSchema$()];

    this.resetAsyncValidator(ctrl);
    this.setAsyncValidator(ctrl, validators);
  }

  /**
   *
   *
   * @param {AbstractControl} compareWith
   * @memberof CustomerUpdateComponent
   */
  public validateJsonSchema$ = (): AsyncValidatorFn => {
    return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
      const error: ValidationErrors = { isJsonSchema: true };
      if (ctrl.disabled || ctrl.pristine || _.isEmpty(ctrl.value)) {
        return of$(null);
      }

      const {
        isValid,
        errorsAt,
      }: ILanguageSchemaValidateResult = this._languageSvc.validateSchema(
        Util.fromJson(ctrl.value)
      );
      if (!isValid) {
        _.set(error, 'isJsonSchema.property', errorsAt);
      }

      this._changeDetectorRef.markForCheck();
      return of$(isValid ? null : error);
    };
  };

  /**
   *
   *
   * @protected
   * @description `this.getFormCtrl('i18N')`の方には `subscribeOnChange`のイベントハンドラ内で値が自動的にセットされるのでここで初期値を設定しなくてもよい。
   * @param {FormGroup} [form=this.form]
   * @param {string} [parent=undefined]
   * @param {(keyof ILanguage)[]} [ignore=['i18N', 'rawJson']]
   * @memberof LanguageUpdateComponent
   */
  protected pluckRowDataToFormControl(
    form: FormGroup = this.form,
    parent: string = undefined,
    ignore: (keyof ILanguage)[] = ['i18N', 'rawJson']
  ): void {
    super.pluckRowDataToFormControl(form, parent, ignore);
    const value: any = Util.fromJson(_.get(this.row, 'i18N'));
    this.getFormCtrl('rawJson').patchValue(value);
  }

  /**
   *
   *
   * @memberof LanguageUpdateComponent
   */
  public toggle(): void {
    this.rawMode = !this.rawMode;
  }
}
