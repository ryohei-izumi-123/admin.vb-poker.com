import { EventEmitter } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { _ } from '@core/class/util';
import { IEntity } from '@shared/interfaces';
import { TStatus } from '@shared/types';

/**
 *
 *
 * @export
 * @deprecated
 * @description `status` filter for `ClrDatagrid`. please use `StatusDgFilterComponent` instead.
 * @class StatusFilter
 * @implements {ClrDatagridFilterInterface<IEntity>}
 */
export class StatusFilter implements ClrDatagridFilterInterface<IEntity> {
  /**
   *
   *
   * @type {TStatus[]}
   * @memberof StatusFilter
   */
  public value: TStatus[] = [];

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof StatusFilter
   */
  private _active: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof StatusFilter
   */
  public get active(): boolean {
    return this._active;
  }

  /**
   *
   *
   * @memberof StatusFilter
   */
  public set active(active: boolean) {
    this._active = active;
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof StatusFilter
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   *
   *
   * @memberof StatusFilter
   */
  public changes: EventEmitter<IEntity> = new EventEmitter<IEntity>(null);

  /**
   *
   *
   * @param {IEntity} row
   * @returns {boolean}
   * @memberof StatusFilter
   */
  public accepts(row: IEntity): boolean {
    const status: TStatus = _.get(row, 'status') as TStatus;
    return this.value.includes(status);
  }
}
