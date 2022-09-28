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
import { _ } from '@core/class/util';
import { Subscription } from 'rxjs';
import { map, take, skipWhile } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { BaseFilterComponent } from '@core/class/base-filter.component';
import { IEntity, IOption } from '@shared/interfaces';
import { OptionService } from '@shared/services';

/**
 *
 * @description Datagridのフィルター用のコンポーネント。フィルターのインターフェイスを保持するため、 `property`, `value`の項目が必要。
 * @see input datalist(HTML5)の仕様なので文字列しか扱えずkey/value的に扱うことはできない。そのため `[ngValue]="item"`のようにはできない。
 * @export
 * @class DatalistFilterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-datalist-filter',
  templateUrl: './datalist-filter.component.html',
  styleUrls: ['./datalist-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatalistFilterComponent
  extends BaseFilterComponent<IEntity>
  implements OnInit, OnDestroy, OnChanges, ClrDatagridFilterInterface<IEntity> {
  /**
   *
   * @description `<option>`タグ内のラベルを指定。`username`など。
   * @protected
   * @type {keyof IEntity}
   * @memberof DatalistFilterComponent
   */
  protected _display: keyof IEntity = null;

  /**
   *
   *
   * @type {keyof IEntity}
   * @memberof DatalistFilterComponent
   */
  public get display(): keyof IEntity {
    return this._display;
  }

  /**
   *
   *
   * @memberof DatalistFilterComponent
   */
  @Input()
  public set display(display: keyof IEntity) {
    this._display = display;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {keyof IOption}
   * @memberof DatalistFilterComponent
   */
  protected _resource: keyof IOption = null;

  /**
   *
   *
   * @type {keyof IOption}
   * @memberof DatalistFilterComponent
   */
  public get resource(): keyof IOption {
    return this._resource;
  }

  /**
   *
   *
   * @memberof DatalistFilterComponent
   */
  @Input()
  public set resource(resource: keyof IOption) {
    this._resource = resource;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of DatalistFilterComponent.
   * @param {OptionService} _optionSvc
   * @param {ClrDatagridFilter} _clrDatagridFilter
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof DatalistFilterComponent
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
   * @memberof DatalistFilterComponent
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
   * @memberof DatalistFilterComponent
   */
  private _initOptions(): Subscription {
    return this._subscription.add(
      this._optionSvc
        .getOption$()
        .pipe(
          skipWhile(() => _.isEmpty(this.resource)),
          map((datalist: IOption) => _.get(datalist, this.resource)),
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
   * @memberof DatalistFilterComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      datalist: new FormControl(
        null,
        Validators.compose([Validators.minLength(4), Validators.maxLength(16)])
      ),
    });
  }

  /**
   *
   *
   * @memberof DatalistFilterComponent
   */
  public onChange(): void {
    const id: number = this.getFormCtrl('datalist').value;
    const value: IEntity = this._findById(id);
    this.values = [value];
    this.active = !_.isEmpty(this.values);
    this.close();
  }

  /**
   *
   *
   * @private
   * @description `Array.filter`は見つからない場合は`undefined`が返却されるので明示的にnullを返す必要があるので注意。
   * @param {number} id
   * @return {IEntity}
   * @memberof DatalistFilterComponent
   */
  private _findById(id: number): IEntity {
    const row: IEntity = this.options.find(
      (option: IEntity) => _.toNumber(option.id) === _.toNumber(id)
    );

    return row ? row : null;
  }

  /**
   *
   * @param {IEntity} value
   * @return {*}
   * @memberof DatalistFilterComponent
   */
  public displayAs(value: IEntity): any {
    return _.get(value, this.display);
  }
}
