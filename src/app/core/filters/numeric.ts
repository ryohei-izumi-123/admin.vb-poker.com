import { ClrDatagridNumericFilterInterface } from '@clr/angular';
import { _ } from '@core/class/util';
import { IEntity } from '@shared/interfaces/entity';

/**
 *
 *
 * @export
 * @class NumericFilter
 * @deprecated
 * @example `<clr-dg-numeric-filter [clrDgNumericFilter]="numericFilter"></clr-dg-numeric-filter>`
 * @implements {ClrDatagridNumericFilterInterface<T>}
 * @template T
 */
export class NumericFilter<T extends IEntity>
  implements ClrDatagridNumericFilterInterface<T> {
  /**
   *
   *
   * @private
   * @type {(keyof T)}
   * @memberof NumericFilter
   */
  private _property: keyof T = null;

  /**
   *
   *
   * @memberof NumericFilter
   */
  public set property(property: keyof T) {
    this._property = property;
  }

  /**
   *
   *
   * @memberof NumericFilter
   */
  public get property(): keyof T {
    return this._property;
  }

  /**
   *Creates an instance of NumericFilter.
   * @memberof NumericFilter
   */
  public constructor() {}

  /**
   *
   *
   * @param {T} item
   * @param {number} min
   * @param {number} max
   * @returns {boolean}
   * @memberof NumericFilter
   */
  public accepts(item: T, min: number, max: number): boolean {
    const val: number = _.get(item, this._property);
    if (_.isUndefined(min) || _.isNull(min)) {
      min = Number.NEGATIVE_INFINITY;
    }

    if (_.isUndefined(max) || _.isNull(max)) {
      max = Number.POSITIVE_INFINITY;
    }

    return (
      _.toNumber(val) >= _.toNumber(min) && _.toNumber(val) <= _.toNumber(max)
    );
  }
}
