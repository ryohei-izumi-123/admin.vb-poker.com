import { ClrDatagridStringFilterInterface } from '@clr/angular';
import { _ } from '@core/class/util';
import { IEntity } from '@shared/interfaces/entity';

/**
 *
 *
 * @export
 * @class StringFilter
 * @deprecated
 * @implements {ClrDatagridStringFilterInterface<T>}
 * @template T
 */
export class StringFilter<T extends IEntity>
  implements ClrDatagridStringFilterInterface<T> {
  /**
   *
   *
   * @private
   * @type {(keyof T)}
   * @memberof StringFilter
   */
  private _property: keyof T = null;

  /**
   *
   *
   * @memberof StringFilter
   */
  public set property(property: keyof T) {
    this._property = property;
  }

  /**
   *
   *
   * @memberof StringFilter
   */
  public get property(): keyof T {
    return this._property;
  }

  /**
   *Creates an instance of StringFilter.
   * @param {(keyof T)} property
   * @memberof StringFilter
   */
  public constructor() {}

  /**
   *
   *
   * @param {T} item
   * @param {string} filter
   * @returns {boolean}
   * @memberof StringFilter
   */
  public accepts(item: T, filter: string): boolean {
    const val: string = _.get(item, this._property);
    return _.toLower(_.toString(val)).includes(_.toLower(_.toString(filter)));
  }
}
