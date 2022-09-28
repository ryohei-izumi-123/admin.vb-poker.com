import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { ISetting, IOption, ICurrency } from '@shared/interfaces';
import {
  OptionService,
  SettingService,
  CountryService,
  ValidateService,
  ToasterService,
} from '@shared/services';
import { BaseUpdateComponent } from '@core/class/base-update.component';
import { AppValidator } from '@core/class/app-validator';

/**
 *
 *
 * @export
 * @class SettingUpdateComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-setting-update',
  templateUrl: './setting-update.component.html',
  styleUrls: ['./setting-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingUpdateComponent
  extends BaseUpdateComponent<ISetting, SettingService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof SettingUpdateComponent
   */
  protected _modelName: string = 'settings';

  /**
   *
   *
   * @type {SettingUpdateComponent[]}
   * @memberof AccountUpdateComponent
   */
  public currencies: ICurrency[] = [];

  /**
   * Creates an instance of SettingUpdateComponent.
   * @param {TranslateService} _translateSvc
   * @param {OptionService} _optionSvc
   * @param {ValidateService} _validateSvc
   * @param {ToasterService} _toasterSvc
   * @param {CountryService} _countrySvc
   * @param {SettingService} _settingSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof SettingUpdateComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _optionSvc: OptionService,
    protected _validateSvc: ValidateService,
    protected _toasterSvc: ToasterService,
    protected _countrySvc: CountryService,
    protected _settingSvc: SettingService,
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _validateSvc,
      _toasterSvc,
      _settingSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof SettingUpdateComponent
   */
  public ngOnInit() {
    this.initCurrencies();
    this.initForm();
    this._subscription.add(this.fromRouteData$().subscribe());
  }

  /**
   *
   *
   * @private
   * @return {Subscription}
   * @memberof SettingUpdateComponent
   */
  private initCurrencies(): Subscription {
    return this._subscription.add(
      this._optionSvc.option$
        .pipe(
          map((option: IOption) => option.currencies),
          take(1)
        )
        .subscribe((data: ICurrency[]) => {
          this.currencies = data;
          this._changeDetectorRef.markForCheck();
        })
    );
  }

  /**
   *
   *
   * @memberof SettingUpdateComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ])
      ),
      fee: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          AppValidator.isDecimal,
        ])
      ),
      address: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(256),
        ])
      ),
      currencyId: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      config: new FormControl(
        '',
        Validators.compose([Validators.maxLength(3000)])
      ),
      status: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.setAsyncValidators();
  }

  /**
   *
   *
   * @protected
   * @memberof SettingUpdateComponent
   */
  protected setAsyncValidators(): void {}

  /**
   *
   *
   * @protected
   * @returns {Observable<IAuth>}
   * @memberof SettingUpdateComponent
   */
  protected update$(): Observable<ISetting> {
    const payload: ISetting = this.form.value as ISetting;
    _.set(payload, 'id', this.row.id);

    return this._settingSvc.update$(payload).pipe(take(1));
  }
}
