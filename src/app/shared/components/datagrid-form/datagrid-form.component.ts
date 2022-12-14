import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  EventEmitter,
  Output,
  Renderer2,
} from '@angular/core';
import {
  Validators,
  FormControl,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NEVER as NEVER$, of as of$, Subscription } from 'rxjs';
import { distinctUntilChanged, take, finalize } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { moment } from '@core/class/util';
import { BaseFormComponent } from '@core/class/base-form.component';
import { IDgFormOptions, IDgFormValue } from '@shared/interfaces/dg';

/**
 *
 *
 * @export
 * @class DatagridFormComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-datagrid-form',
  templateUrl: './datagrid-form.component.html',
  styleUrls: ['./datagrid-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFormComponent
  extends BaseFormComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof DatagridFormComponent
   */
  private _isOpen: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof DatagridFormComponent
   */
  public set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
    this._expandDatagridHost();
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof DatagridFormComponent
   */
  public get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   *
   *
   * @readonly
   * @type {HTMLElement}
   * @memberof DatagridFormComponent
   */
  public get $datagird(): HTMLElement {
    return document.querySelector('.datagrid-host');
  }

  /**
   *
   *
   * @private
   * @type {IDgFormOptions}
   * @memberof DatagridFormComponent
   */
  private _options: IDgFormOptions = {
    query: true,
    createdAt: true,
  };

  /**
   *
   *
   * @readonly
   * @type {IDgFormOptions}
   * @memberof DatagridFormComponent
   */
  public set options(options: IDgFormOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IDgFormOptions}
   * @memberof DatagridFormComponent
   */
  public get options(): IDgFormOptions {
    return this._options;
  }

  /**
   *
   *
   * @type {EventEmitter<IDgFormValue>}
   * @memberof DatagridFormComponent
   */
  @Output()
  public afterSubmit$: EventEmitter<IDgFormValue> = new EventEmitter();

  /**
   * Creates an instance of DatagridFormComponent.
   * @param {Renderer2} _renderer2
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof DatagridFormComponent
   */
  public constructor(
    private _renderer2: Renderer2,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof DatagridFormComponent
   */
  public ngOnDestroy() {
    this.afterSubmit$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof DatagridFormComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @memberof DatagridFormComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      query: new FormControl(
        '',
        Validators.compose([Validators.minLength(4), Validators.maxLength(16)])
      ),
    });

    if (_.get(this.options, 'createdAt')) {
      this.form.addControl(
        'toggle',
        new FormControl(false, Validators.compose([]))
      );
      this.form.addControl('createdAt', this.getDateRangeControl());
      this._subscribeOnToggle();
      this._setValidators();
    }
  }

  /**
   *
   * @description `Toggle`????????????????????????ON/OFF????????????????????????????????????????????????????????????/?????????????????????????????????/??????????????????????????????
   * @private
   * @return {Subscription}
   * @memberof DatagridFormComponent
   */
  private _subscribeOnToggle(): Subscription {
    const ctrl: AbstractControl = this.getFormCtrl('toggle');
    const group: FormGroup = this.getFormGroup('createdAt');

    return this._subscription.add(
      ctrl.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((value: boolean) =>
          value ? group.enable() : group.disable()
        )
    );
  }

  /**
   *
   * @description submit????????? `EventEmitter`?????????`@Output`????????????????????????????????????????????????????????????????????????????????????????????????????????????
   * @returns {Subscription}
   * @memberof DatagridFormComponent
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
      of$(this.form.value)
        .pipe(
          finalize(() => (this.isBusy = false)),
          take(1)
        )
        .subscribe((value: IDgFormValue) => this.afterSubmit$.emit(value))
    );
  }

  /**
   *
   *
   * @protected
   * @memberof DatagridFormComponent
   */
  private _setValidators(): void {
    this.validateDateRange();
  }

  /**
   *
   * @description ???????????????????????????
   * @memberof DatagridFormComponent
   */
  public validateDateRange(): void {
    const group: FormGroup = this.getFormGroup('createdAt');
    const from: FormGroup = this.getFormGroup('from', group);
    const to: FormGroup = this.getFormGroup('to', group);
    this.setValidator(to, [this.validateDateRange$(from)]);

    // ?????????????????????to????????????????????????????????????from???????????????????????????????????????????????????????????????????????????
    this._subscription.add(
      from.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe(() => to.updateValueAndValidity())
    );
  }

  /**
   *
   *
   * @private
   * @description ?????????date+time)??? `Moment`????????????????????????
   * @param {FormGroup} group
   * @return {moment.Moment}
   * @memberof DatagridFormComponent
   */
  private _toMoment(group: FormGroup): moment.Moment {
    const value: any = _.get(group, 'value');
    const datetime: string = `${_.get(value, 'date')} ${_.get(value, 'time')}`;

    return moment(datetime).clone();
  }

  /**
   *
   * @description ???????????????????????????
   * @param {FormGroup} compareWith
   * @memberof DatagridFormComponent
   */
  public validateDateRange$ = (compareWith: FormGroup): ValidatorFn => {
    return (group: FormGroup): ValidationErrors | null => {
      const error: ValidationErrors = { isDateRange: true };
      if (group.disabled) {
        return null;
      }

      if (!group.value || !compareWith) {
        return null;
      }

      const from = this._toMoment(compareWith);
      const to = this._toMoment(group);
      if (!from.isValid() || !to.isValid()) {
        // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        return null;
      }

      const isValid: boolean = to.unix() >= from.unix();
      const result: ValidationErrors = isValid ? null : error;
      // ???????????????????????????group????????????????????????????????????????????????????????????????????????????????????????????????NULL??????????????????`clr-control-error`???????????????????????????
      _.keys(group.controls).map((k: string) =>
        this.getFormCtrl(k, group).setErrors(result)
      );

      return result;
    };
  };

  /**
   *
   *
   * @private
   * @return {void}
   * @memberof DatagridFormComponent
   */
  private _expandDatagridHost(): void {
    if (!this.$datagird) {
      return;
    }

    const clazz: string = 'datagrid-expanded';
    if (this.isOpen) {
      this._renderer2.addClass(this.$datagird, clazz);
    } else {
      this._renderer2.removeClass(this.$datagird, clazz);
    }
  }
}
