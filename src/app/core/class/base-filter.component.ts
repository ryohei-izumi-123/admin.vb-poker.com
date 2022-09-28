import { toJSON } from 'lodash-es/toJSON';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { ClrDatagridFilterInterface, ClrDatagridFilter } from '@clr/angular';
import { _, Util } from '@core/class/util';
import { NEVER as NEVER$, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormComponent } from '@core/class/base-form.component';
import { IEntity } from '@shared/interfaces';

/**
 * @template T
 * @template V
 * @description Datagridのフィルター用のコンポーネント。フィルターのインターフェイスを保持するため、 `property`, `value`の項目が必要。
 * @export
 * @class BaseFilterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-filter',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseFilterComponent<T>
  extends BaseFormComponent
  implements OnInit, OnDestroy, OnChanges, ClrDatagridFilterInterface<IEntity> {
  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof BaseFilterComponent
   */
  public changes: EventEmitter<boolean> = new EventEmitter<boolean>(null);

  /**
   *
   *
   * @protected
   * @type {T[]}
   * @memberof BaseFilterComponent
   */
  protected _options: T[];

  /**
   *
   *
   * @type {T[]}
   * @memberof BaseFilterComponent
   */
  public get options(): T[] {
    return this._options;
  }

  /**
   *
   *
   * @memberof BaseFilterComponent
   */
  @Input()
  public set options(options: T[]) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof BaseFilterComponent
   */
  protected _property: string = null;

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof BaseFilterComponent
   */
  public get property(): string {
    return this._property;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof BaseFilterComponent
   */
  @Input()
  public set property(property: string) {
    this._property = property;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @description `values`をGETのクエリに渡せるようフォーマットする。
   * @template T
   * @readonly
   * @type {T[]}
   * @memberof BaseFilterComponent
   */
  public get value(): any[] {
    return this._values
      .map((value: T) => {
        const isEntityLike = _.isObjectLike(value) && _.has(value, 'id');
        return isEntityLike ? _.get(value, 'id') : value;
      })
      .filter((value: T) => !_.isNull(value));
  }

  /**
   *
   * @template T
   * @protected
   * @type {TemplateStringsArray[]}
   * @memberof BaseFilterComponent
   */
  protected _values: T[] = [];

  /**
   *
   * @template T
   * @readonly
   * @type {T[]}
   * @memberof BaseFilterComponent
   */
  public get values(): T[] {
    return this._values;
  }

  /**
   *
   * @template T
   * @readonly
   * @type {T[]}
   * @memberof BaseFilterComponent
   */
  public set values(values: T[]) {
    this._values = values;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {boolean}
   * @memberof BaseFilterComponent
   */
  protected _active: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof BaseFilterComponent
   */
  public get active(): boolean {
    return this._active;
  }

  /**
   *
   *
   * @memberof BaseFilterComponent
   */
  public set active(active: boolean) {
    this._active = active;
    this.changes.emit(active);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of BaseFilterComponent.
   * @param {ClrDatagridFilter} _clrDatagridFilter
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseFilterComponent
   */
  public constructor(
    protected _clrDatagridFilter: ClrDatagridFilter,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
    this._clrDatagridFilter.setFilter(this);
  }

  /**
   *
   *
   * @memberof BaseFilterComponent
   */
  public ngOnInit() {
    super.ngOnInit();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof BaseFilterComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @memberof BaseFilterComponent
   */
  public ngOnDestroy() {
    this.changes.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof BaseFilterComponent
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   *
   *
   * @param {T} value
   * @returns {boolean}
   * @memberof BaseFilterComponent
   */
  public isSelected(value: T): boolean {
    if (_.isUndefined(value) || _.isNull(value)) {
      return false;
    }

    if (_.isString(value) || _.isNumber(value) || _.isBoolean(value)) {
      return this.values.includes(value);
    }

    if (_.isObjectLike(value)) {
      const found: T = this.values.find(
        (v: T) => Util.toJson(v) === Util.toJson(value)
      );

      return !_.isUndefined(found);
    }

    return false;
  }

  /**
   *
   *
   * @param {IEntity} item
   * @returns {boolean}
   * @memberof BaseFilterComponent
   */
  public accepts(item: IEntity): boolean {
    const value: T = _.get(item, this.property) as T;
    return this.isSelected(value);
  }

  /**
   *
   * @protected
   * @param {T} value
   * @memberof BaseFilterComponent
   */
  protected addValue(value: T): void {
    this.values.push(value);
  }

  /**
   *
   * @protected
   * @param {T} value
   * @memberof BaseFilterComponent
   */
  protected removeValue(value: T): void {
    const idx: number = this.values.indexOf(value, 0);
    if (idx > -1) {
      this.values.splice(idx, 1);
    }
  }

  /**
   *
   * @returns {Subscription}
   * @memberof BaseFilterComponent
   */
  public onSubmit(): Subscription {
    const isValid: boolean = this.form.valid;
    const isBusy: boolean = this.isBusy;
    if (!isValid || isBusy) {
      return this._subscription.add(NEVER$.subscribe());
    }

    this.isBusy = true;
    this.error = null;
    this.active = true;

    return this._subscription.add(NEVER$.subscribe());
  }

  /**
   *
   *
   * @memberof BaseFilterComponent
   */
  public close(): void {
    this._clrDatagridFilter.open = false;
    this._changeDetectorRef.detectChanges();
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof BaseFilterComponent
   */
  public get label(): string {
    return this.translate(`common.${this.property}`);
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof BaseFilterComponent
   */
  public get placeholder(): string {
    return this.translate(`placeholder.${this.property}`);
  }

  /**
   *
   *
   * @memberof BaseFilterComponent
   */
  public abstract initForm(): void;
}
