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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClrDatagridFilterInterface, ClrDatagridFilter } from '@clr/angular';
import { skipWhile, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppValidator } from '@core/class/app-validator';
import { BaseFilterComponent } from '@core/class/base-filter.component';
import { IEntity, IDgNumericFilterAttributes } from '@shared/interfaces';

/**
 *
 * @description Datagridのフィルター用のコンポーネント。フィルターのインターフェイスを保持するため、 `property`, `value`の項目が必要。
 * @export
 * @class RangeFilterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent
  extends BaseFilterComponent<number>
  implements OnInit, OnDestroy, OnChanges, ClrDatagridFilterInterface<IEntity> {
  /**
   *
   *
   * @protected
   * @type {IDgNumericFilterAttributes}
   * @memberof BaseFilterComponent
   */
  protected _attributes: IDgNumericFilterAttributes = {
    step: 0.0001,
    min: 10000,
    max: 1000000000,
  };

  /**
   *
   *
   * @readonly
   * @type {IDgNumericFilterAttributes}
   * @memberof RangeFilterComponent
   */
  public get attributes(): IDgNumericFilterAttributes {
    return this._attributes;
  }

  /**
   *
   *
   * @readonly
   * @type {IDgNumericFilterAttributes}
   * @memberof RangeFilterComponent
   */
  @Input()
  public set attributes(attributes: IDgNumericFilterAttributes) {
    this._attributes = attributes;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of RangeFilterComponent.
   * @param {OptionService} _optionSvc
   * @param {ClrDatagridFilter} _clrDatagridFilter
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof RangeFilterComponent
   */
  public constructor(
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
   * @memberof RangeFilterComponent
   */
  public ngOnInit() {
    super.ngOnInit();
  }

  /**
   *
   *
   * @memberof RangeFilterComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      range: new FormControl(
        '',
        Validators.compose([
          Validators.min(this.attributes.min || 10000),
          Validators.max(this.attributes.max || 1000000000),
          AppValidator.isDecimal,
        ])
      ),
    });

    this._subscription.add(
      this.getFormCtrl('range')
        .valueChanges.pipe(
          skipWhile(() => this.form.pristine),
          distinctUntilChanged()
        )
        .subscribe((value: number) => {
          this.values = [value];
          this.active = this.form.valid;
        })
    );
  }
}
