import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  QueryList,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AsyncValidatorFn,
} from '@angular/forms';
import { Subscription, merge as merge$ } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { _, Util } from '@core/class/util';
import { moment } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';
import { AppValidator } from '@core/class/app-validator';
import { ButtonComponent } from '@shared/components/button/button.component';

/**
 *
 *
 * @export
 * @class BaseFormComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-form',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseFormComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {EventEmitter<Error>}
   * @memberof BaseFormComponent
   */
  @Output()
  public onError$: EventEmitter<Error> = new EventEmitter();

  /**
   *
   *
   * @type {QueryList<ButtonComponent>}
   * @memberof BaseFormComponent
   */
  @ViewChildren(ButtonComponent)
  public $buttons: QueryList<ButtonComponent>;

  /**
   *
   *
   * @type {ButtonComponent}
   * @memberof BaseFormComponent
   */
  @ViewChild('$submit')
  public $submit: ButtonComponent;

  /**
   *
   *
   * @protected
   * @type {Error}
   * @memberof BaseFormComponent
   */
  protected _error: Error;

  /**
   *
   *
   * @public
   * @type {Error}
   * @memberof BaseFormComponent
   */
  public get error(): Error {
    return this._error;
  }

  /**
   *
   *
   * @public
   * @type {Error}
   * @memberof BaseFormComponent
   */
  public set error(error: Error) {
    this._error = error;
    this.onError$.emit(error);

    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @public
   * @type {FormGroup}
   * @memberof BaseFormComponent
   */
  public set form(form: FormGroup) {
    this._form = form;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {FormGroup}
   * @memberof BaseFormComponent
   */
  public get form(): FormGroup {
    return this._form;
  }

  /**
   *
   *
   * @type {FormGroup}
   * @memberof BaseFormComponent
   */
  protected _form: FormGroup;

  /**
   * Creates an instance of BaseFormComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseFormComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof BaseFormComponent
   */
  public ngOnInit() {
    this.initForm();
  }

  /**
   *
   *
   * @memberof BaseFormComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @memberof BaseFormComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {string} ctrl
   * @param {FormGroup} [form=this.form]
   * @return {{AbstractControl}
   * @memberof BaseFormComponent
   */
  public getFormCtrl(
    ctrl: string,
    form: FormGroup = this.form
  ): AbstractControl {
    return form.get(ctrl);
  }

  /**
   *
   *
   * @param {string} group
   * @param {FormGroup} [form=this.form]
   * @returns {FormGroup}
   * @memberof BaseFormComponent
   */
  public getFormGroup(group: string, form: FormGroup = this.form): FormGroup {
    return form.controls
      ? (_.get(form.controls, `${group}`) as FormGroup)
      : form;
  }

  /**
   *
   *
   * @param {string} group
   * @param {string} [ctrl=null]
   * @returns {*}
   * @memberof BaseFormComponent
   */
  public getFormValue(group: string, ctrl: string = null): any {
    const formGroup: FormGroup = this.getFormGroup(group);
    const value: any = formGroup ? formGroup.value : this.form.value;
    if (!_.isEmpty(ctrl) && _.has(value, ctrl)) {
      return _.get(value, ctrl);
    }

    return value;
  }

  /**
   *
   * @description 日時のコントロールを生成する。
   * @param {('from' | 'to')} name
   * @param {boolean} [disabled=true]
   * @return {FormGroup}
   * @memberof BaseFormComponent
   */
  public getDateTimeControl(
    name: 'from' | 'to',
    disabled: boolean = true
  ): FormGroup {
    const format: string = 'YYYY-MM-DD';
    const isFrom: boolean = name === 'from';
    const date: string = isFrom
      ? moment(new Date()).clone().startOf('month').format(format)
      : moment(new Date()).clone().endOf('month').format(format);
    const time: string = isFrom ? '00:00:00' : '23:59:59';

    return new FormGroup({
      date: new FormControl(
        {
          value: date,
          disabled,
        },
        Validators.compose([Validators.required, AppValidator.isDate])
      ),
      time: new FormControl(
        {
          value: time,
          disabled,
        },
        Validators.compose([Validators.required, AppValidator.isTime])
      ),
    });
  }

  /**
   *
   * @description 日付（レンジ）検索のコントロールを生成する。デフォルトは非活性（初期検索時に意図せず日付がパラメータとして渡ることを防ぐため。
   * @param {boolean} [disabled=true]
   * @return {FormGroup}
   * @memberof BaseFormComponent
   */
  public getDateRangeControl(disabled: boolean = true): FormGroup {
    return new FormGroup({
      from: this.getDateTimeControl('from', disabled),
      to: this.getDateTimeControl('to', disabled),
    });
  }

  /**
   *
   *
   * @param {string} [formGroupName='from']
   * @param {string} [dateCtrlName='date']
   * @param {string} [timeCtrlName='time']
   * @returns {moment.Moment}
   * @memberof BaseFormComponent
   */
  public getDateTimeByFormGroup(
    formGroupName: string = 'from',
    dateCtrlName: string = 'date',
    timeCtrlName: string = 'time'
  ): moment.Moment {
    const group: FormGroup = this.getFormGroup(formGroupName);
    if (!group) {
      return null;
    }

    const dateCtrl: AbstractControl = this.getFormCtrl(dateCtrlName, group);
    const timeCtrl: AbstractControl = this.getFormCtrl(timeCtrlName, group);
    if (!dateCtrl || !timeCtrl) {
      return null;
    }

    const time: moment.Moment = moment(timeCtrl.value, 'HH:mm:ss');

    return moment(dateCtrl.value).set({
      hour: time.get('hour'),
      minute: time.get('minute'),
      second: time.get('second'),
    });
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public get canSubmit(): boolean {
    return this.form.valid && !this.isBusy;
  }

  /**
   *
   * @description `form.invalid` === false　でも form.status === pendingの場合は本来Submitしてはいけない。
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public get hasFormError(): boolean {
    return !this.canSubmit;
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasError(ctrl: AbstractControl): boolean {
    return (ctrl.invalid || ctrl.errors) && (ctrl.dirty || ctrl.touched);
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorRequired(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.required');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorMin(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.min');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorMax(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.max');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorMinlength(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.minlength');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorMaxlength(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.maxlength');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorEmail(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.email');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {number}
   * @memberof BaseFormComponent
   */
  public getMinLength(ctrl: AbstractControl): number {
    // ctrl.errors.minlength.actualLength;
    return parseInt(_.get(ctrl, 'errors.minlength.requiredLength', 0), 10);
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {number}
   * @memberof BaseFormComponent
   */
  public getMaxLength(ctrl: AbstractControl): number {
    // ctrl.errors.maxlength.actualLength;
    return parseInt(_.get(ctrl, 'errors.maxlength.requiredLength', 0), 10);
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {number}
   * @memberof BaseFormComponent
   */
  public getMinNumber(ctrl: AbstractControl): number {
    return parseInt(_.get(ctrl, 'errors.max.min', 0), 10);
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {number}
   * @memberof BaseFormComponent
   */
  public getMaxNumber(ctrl: AbstractControl): number {
    // ctrl.errors.max.actualLength;
    return parseInt(_.get(ctrl, 'errors.max.max', 0), 10);
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {string}
   * @memberof BaseFormComponent
   */
  public getJsonSchemaProperty(ctrl: AbstractControl): string {
    return _.get(ctrl, 'errors.isJsonSchema.property', '');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorAsync(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.async');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorJson(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isJson');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorJsonSchema(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isJsonSchema');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorDate(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isDate');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @return {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorDateRange(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isDateRange');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorTime(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isTime');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorNumber(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isNumber');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorNumberLike(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isNumberLike');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorNum(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isNum');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorDecimal(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isDecimal');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorAlphaLower(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isAlphaLower');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorAlphaUpper(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isAlphaUpper');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorAlphaNum(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isAlphaNum');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorAlpha(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isAlpha');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorSymbol(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isSymbol');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorNoSymbol(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isNoSymbol');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorJpMobilePhone(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isJpMobilePhone');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorStrongPassword(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isStrongPassword');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorSamePassword(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isSamePassword');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorHalfSize(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isHalfSize');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorFullSize(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isFullSize');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorNoSpace(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isNoSpace');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorValidPasswordChar(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isValidPasswordChar');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorValidFile(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isValidFile');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorValidFileSize(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isValidFileSize');
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public hasErrorValidFileExtension(ctrl: AbstractControl): boolean {
    return _.get(ctrl, 'errors.isValidFileExtension');
  }

  /**
   *
   *
   * @memberof BaseFormComponent
   */
  public reset(): void {
    this.error = null;
    this.isBusy = false;
    if (this.form) {
      this.getFormCtrls().map((ctrl: AbstractControl) =>
        this.resetFormCtrl.bind(ctrl)
      );
      this.resetFormCtrl(this.form);
    }

    if (this.$buttons) {
      this.$buttons.map(($button: ButtonComponent) => $button.setDefault());
    }
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @memberof BaseFormComponent
   */
  public resetFormCtrl(ctrl: AbstractControl): void {
    ctrl.reset();
    ctrl.markAsPristine();
    ctrl.markAsUntouched();
  }

  /**
   *
   * @example `<select clrSelect formControlName="type" [compareWith]="defaultCompareWith"></select>`
   * @description this is a function in order to compare value for `select`.
   * @param {any} val1
   * @param {any} val2
   * @returns {boolean}
   * @memberof BaseFormComponent
   */
  public defaultCompareWith(val1: any, val2: any): boolean {
    return Util.toJson(val1) === Util.toJson(val2);
  }
  /**
   *
   *
   * @protected
   * @param {FormGroup} [form=this.form]
   * @returns {AbstractControl[]}
   * @memberof BaseFormComponent
   */
  protected findInvalidFormControls(
    form: FormGroup = this.form
  ): AbstractControl[] {
    const controls: {
      [key: string]: AbstractControl;
    } = _.get(form, 'controls');

    return _.flattenDeep(
      _.keys(controls)
        .filter((name: string) => _.get(controls, `${name}.invalid`))
        .map((name: string) => {
          const ctrl: AbstractControl = _.get(controls, name);
          const nested: boolean = ctrl instanceof FormGroup;

          return nested
            ? this.findInvalidFormControls(ctrl as FormGroup)
            : ctrl;
        })
    );
  }

  /**
   *
   *
   * @protected
   * @param {FormGroup} [form=this.form]
   * @return {string[]}
   * @memberof BaseFormComponent
   */
  protected getFormCtrlFields(form: FormGroup = this.form): string[] {
    return _.keys(_.get(form, 'controls'));
  }

  /**
   *
   *
   * @protected
   * @param {FormGroup} [form=this.form]
   * @return {AbstractControl[]}
   * @memberof BaseFormComponent
   */
  protected getFormCtrls(form: FormGroup = this.form): AbstractControl[] {
    const controls: {
      [key: string]: AbstractControl;
    } = _.get(form, 'controls');

    return _.keys(controls).map((k: string) => _.get(controls, `${k}`));
  }

  /**
   *
   *
   * @memberof BaseFormComponent
   */
  public abstract initForm(): void;

  /**
   *
   *
   * @returns {Subscription}
   * @memberof BaseFormComponent
   */
  public abstract onSubmit(): Subscription;

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @param {AsyncValidatorFn[]} validators
   * @memberof BaseFormComponent
   */
  protected resetAsyncValidator(ctrl: AbstractControl): void {
    ctrl.clearAsyncValidators();
    ctrl.updateValueAndValidity();
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @param {AsyncValidatorFn[]} validators
   * @memberof BaseFormComponent
   */
  protected setAsyncValidator(
    ctrl: AbstractControl,
    validators: AsyncValidatorFn[]
  ): void {
    ctrl.setAsyncValidators(Validators.composeAsync(validators));
    ctrl.updateValueAndValidity();
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @memberof BaseFormComponent
   */
  protected resetValidator(ctrl: AbstractControl): void {
    ctrl.clearValidators();
    ctrl.updateValueAndValidity();
  }

  /**
   *
   *
   * @param {AbstractControl} ctrl
   * @param {ValidatorFn[]} validators
   * @memberof BaseFormComponent
   */
  protected setValidator(
    ctrl: AbstractControl,
    validators: ValidatorFn[]
  ): void {
    ctrl.setValidators(Validators.compose(validators));
    ctrl.updateValueAndValidity();
  }

  /**
   *
   *
   * @protected
   * @param {string} field
   * @param {boolean} [enable=false]
   * @return {void}
   * @memberof BaseFormComponent
   */
  protected toggleCtrl(field: string, enable: boolean = false): void {
    const ctrl: AbstractControl = this.getFormCtrl(field);
    if (enable) {
      ctrl.enable();
      ctrl.reset('');
    } else {
      ctrl.disable();
    }

    ctrl.updateValueAndValidity();
  }

  /**
   *
   * @description 変更検出をすべて検知する（パフォーマンスが悪いので基本的にはバッドノウハウ）
   * @protected
   * @return {Subscription}
   * @memberof BaseFormComponent
   */
  protected subscribeAllChanges(): Subscription {
    return this._subscription.add(
      merge$(
        this.form.statusChanges,
        this.form.valueChanges.pipe(distinctUntilChanged())
      ).subscribe(() => this._changeDetectorRef.markForCheck())
    );
  }
}
