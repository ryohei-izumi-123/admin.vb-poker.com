import { ClrDatagridComparatorInterface } from '@clr/angular';
import { _ } from '@core/class/util';
import { TRole } from '@shared/types';
import { ERole } from '@shared/enum';

/**
 *
 *
 * @export
 * @deprecated server-driven の場合、使用できないので注意。ソートをクライアントサイドで行う場合には有効。
 * @example ts: `public roleComparator: RoleComparator = new RoleComparator();` html: `<clr-dg-column [clrDgField]="'role'" [clrDgSortBy]="roleComparator">...</clr-dg-column>`
 * @class RoleComparator
 * @implements {ClrDatagridComparatorInterface<TRole>}
 */
export class RoleComparator implements ClrDatagridComparatorInterface<TRole> {
  /**
   *
   *
   * @private
   * @param {TRole} val
   * @returns {number}
   * @memberof RoleComparator
   */
  private convertToNumber(val: TRole): number {
    return ERole[_.toUpper(val)] || 0;
  }

  /**
   *
   *
   * @param {TRole} a
   * @param {TRole} b
   * @returns {number}
   * @memberof RoleComparator
   */
  public compare(a: TRole, b: TRole): number {
    //     if compare(a, b) is less than 0, a comes first,
    // if compare(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all other items,
    // if compare(a, b) is greater than 0, b comes first. The safest way to check that your types comply with our API is to have yo
    return this.convertToNumber(a) - this.convertToNumber(b);
  }
}
