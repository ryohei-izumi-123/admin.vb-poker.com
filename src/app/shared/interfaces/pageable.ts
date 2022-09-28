import { IPaginate } from './paginate';

/**
 *
 *
 * @export
 * @interface IPageable
 */
export interface IPageable<T> {
  rows: T[];
  paginate: IPaginate<T>;
}
