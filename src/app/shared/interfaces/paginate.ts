import { TSortOrder } from '@shared/types';
import { IEntity } from './entity';
import { IDgFilterParam, IDgFormValue } from './dg';

/**
 *
 *
 * @export
 * @interface IPaginate
 * @template T
 */
export interface IPaginate<T extends IEntity> {
  filters?: IDgFilterParam<T>;
  search?: IDgFormValue;
  page?: number;
  limit?: number;
  order?: TSortOrder;
  sort?: keyof T;
  readonly total?: number;
  readonly pages?: number;
  readonly offset?: number;
}
