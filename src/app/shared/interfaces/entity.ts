import { TStatus } from '@shared/types';
import { moment } from '@core/class/util';

/**
 *
 *
 * @export
 * @interface IBaseEntity
 */
export interface IBaseEntity {
  [key: string]: any;
}

/**
 *
 *
 * @export
 * @interface IEntity
 * @extends {IBaseEntity}
 */
export interface IEntity extends IBaseEntity {
  readonly id?: number;
  status?: TStatus;
  readonly createdId?: number;
  readonly createdAt?: moment.MomentInput;
  readonly updatedId?: number;
  readonly updatedAt?: moment.MomentInput;
  readonly deletedId?: number;
  readonly deletedAt?: moment.MomentInput;
}
