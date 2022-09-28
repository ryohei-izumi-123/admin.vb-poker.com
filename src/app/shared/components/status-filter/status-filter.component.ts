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
import { TStatus } from '@shared/types';

/**
 *
 * @description Datagridのフィルター用のコンポーネント。フィルターのインターフェイスを保持するため、 `property`, `value`の項目が必要。
 * @export
 * @class StatusFilterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusFilterComponent
  extends BaseFilterComponent<TStatus>
  implements OnInit, OnDestroy, ClrDatagridFilterInterface<IEntity> {
  /**
   * Creates an instance of StatusFilterComponent.
   * @param {ClrDatagridFilter} _clrDatagridFilter
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof StatusFilterComponent
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
   * @memberof StatusFilterComponent
   */
  public ngOnInit() {
    this.property = 'status';
    this.options = ['active', 'inactive', 'pending'];
    super.ngOnInit();
  }

  /**
   *
   *
   * @memberof StatusFilterComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      status: new FormControl(null),
    });
  }

  /**
   *
   *
   * @param {TStatus} value
   * @memberof StatusFilterComponent
   */
  public onChange(value: TStatus): void {
    this.isSelected(value) ? this.removeValue(value) : this.addValue(value);
    this.active = !_.isEmpty(this.values);
  }
}
