import { ClrDatagridComparatorInterface } from '@clr/angular';
import { _ } from '@core/class/util';
import { TStatus } from '@shared/types';
import { EStatus } from '@shared/enum';

/**
 *
 *
 * @export
 * @deprecated server-driven の場合、使用できないので注意。ソートをクライアントサイドで行う場合には有効。
 * @example ts: `public statusComparator: StatusComparator = new StatusComparator();` html: `<clr-dg-column [clrDgField]="'status'" [clrDgSortBy]="statusComparator">...</clr-dg-column>`
 * @class StatusComparator
 * @implements {ClrDatagridComparatorInterface<any>}
 */
export class StatusComparator implements ClrDatagridComparatorInterface<any> {
  /**
   *
   *
   * @private
   * @param {TStatus} val
   * @returns {number}
   * @memberof StatusComparator
   */
  private convertToNumber(val: TStatus): number {
    return EStatus[_.toUpper(val)] || 0;
  }

  /**
   *
   *
   * @param {TStatus} a
   * @param {TStatus} b
   * @returns {number}
   * @memberof StatusComparator
   */
  public compare(a: TStatus, b: TStatus): number {
    return this.convertToNumber(a) - this.convertToNumber(b);
  }
}
