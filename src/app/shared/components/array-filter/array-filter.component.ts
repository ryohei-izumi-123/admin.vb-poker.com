import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ClrDatagridFilterInterface, ClrDatagridFilter } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '@core/class/util';
import { BaseFilterComponent } from '@core/class/base-filter.component';
import { IEntity } from '@shared/interfaces';
import { pluralize } from 'inflected';

/**
 *
 * @description Datagridのフィルター用のコンポーネント。フィルターのインターフェイスを保持するため、 `property`, `value`の項目が必要。
 * @export
 * @class ArrayFilterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-array-filter',
  templateUrl: './array-filter.component.html',
  styleUrls: ['./array-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayFilterComponent
  extends BaseFilterComponent<any>
  implements OnInit, OnDestroy, ClrDatagridFilterInterface<IEntity> {
  /**
   * Creates an instance of ArrayFilterComponent.
   * @param {ClrDatagridFilter} _clrDatagridFilter
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ArrayFilterComponent
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
   * @memberof ArrayFilterComponent
   */
  public ngOnInit() {
    super.ngOnInit();
  }

  /**
   *
   *
   * @memberof ArrayFilterComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      option: new FormControl(null),
    });
  }

  /**
   *
   *
   * @param {any} value
   * @memberof ArrayFilterComponent
   */
  public onChange(value: any): void {
    this.isSelected(value) ? this.removeValue(value) : this.addValue(value);
    this.active = !_.isEmpty(this.values);
  }

  /**
   *
   *
   * @param {string} value
   * @return {{string}
   * @memberof ArrayFilterComponent
   */
  public getLabel(value: string): string {
    return this.translate(`common.${pluralize(this.property)}.${value}`);
  }
}
