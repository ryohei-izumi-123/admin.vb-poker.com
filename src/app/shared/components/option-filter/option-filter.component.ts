import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ClrDatagridFilterInterface, ClrDatagridFilter } from '@clr/angular';
import { _ } from '@core/class/util';
import { Subscription } from 'rxjs';
import {
  map,
  take,
  skipWhile,
  filter,
  distinctUntilChanged,
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { BaseFilterComponent } from '@core/class/base-filter.component';
import { IEntity, IOption } from '@shared/interfaces';
import { OptionService } from '@shared/services';

/**
 *
 * @description Datagridのフィルター用のコンポーネント。フィルターのインターフェイスを保持するため、 `property`, `value`の項目が必要。
 * @export
 * @class OptionFilterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-option-filter',
  templateUrl: './option-filter.component.html',
  styleUrls: ['./option-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionFilterComponent
  extends BaseFilterComponent<IEntity>
  implements OnInit, OnDestroy, OnChanges, ClrDatagridFilterInterface<IEntity> {
  /**
   *
   *
   * @protected
   * @type {keyof IOption}
   * @memberof OptionFilterComponent
   */
  protected _resource: keyof IOption = null;

  /**
   *
   *
   * @type {keyof IOption}
   * @memberof OptionFilterComponent
   */
  public get resource(): keyof IOption {
    return this._resource;
  }

  /**
   *
   *
   * @memberof OptionFilterComponent
   */
  @Input()
  public set resource(resource: keyof IOption) {
    this._resource = resource;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of OptionFilterComponent.
   * @param {OptionService} _optionSvc
   * @param {ClrDatagridFilter} _clrDatagridFilter
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof OptionFilterComponent
   */
  public constructor(
    private _optionSvc: OptionService,
    protected _clrDatagridFilter: ClrDatagridFilter,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_clrDatagridFilter, _translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof OptionFilterComponent
   */
  public ngOnInit() {
    this._initOptions();
    super.ngOnInit();
  }

  /**
   *
   *
   * @private
   * @return {Subscription}
   * @memberof OptionFilterComponent
   */
  private _initOptions(): Subscription {
    return this._subscription.add(
      this._optionSvc
        .getOption$()
        .pipe(
          skipWhile(() => _.isEmpty(this.resource)),
          map((option: IOption) => _.get(option, this.resource)),
          take(1)
        )
        .subscribe((data: IEntity[]) => {
          this.options = data;
          this._changeDetectorRef.markForCheck();
        })
    );
  }

  /**
   *
   *
   * @memberof OptionFilterComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      option: new FormControl(null),
    });
    this._subscription.add(
      this.getFormCtrl('option')
        .valueChanges.pipe(
          skipWhile(() => this.form.pristine),
          distinctUntilChanged(),
          filter(() => this.form.valid)
        )
        .subscribe((value: IEntity) => {
          this.values = [value];
          this.active = !_.isEmpty(this.values);
          this.close();
        })
    );
  }
}
