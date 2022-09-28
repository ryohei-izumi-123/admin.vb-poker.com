import {
  ClrDatagridSortOrder,
  ClrDatagridComparatorInterface,
  ClrDatagridNumericFilterInterface,
  ClrDatagridStringFilterInterface,
  ClrDatagridFilterInterface,
} from '@clr/angular';
import { IEntity } from './entity';

/**
 *
 *
 * @export
 * @interface IDgSort
 * @template T
 */
export interface IDgSort<T> {
  order?: ClrDatagridSortOrder;
  by?: ClrDatagridComparatorInterface<T>;
}

/**
 *
 *
 * @export
 * @interface IDgFilter
 * @template T
 */
export interface IDgFilter<T> {
  operator?:
    | ClrDatagridFilterInterface<T>
    | ClrDatagridStringFilterInterface<T>
    | ClrDatagridNumericFilterInterface<T>;
}

/**
 *
 *
 * @export
 * @interface IDgRouteDataRows
 * @template T
 */
export interface IDgRouteDataRows<T extends IEntity> {
  rows: T[];
}

/**
 *
 *
 * @export
 * @interface IDgRouteDataRow
 * @template T
 */
export interface IDgRouteDataRow<T extends IEntity> {
  row: T;
}

/**
 *
 *
 * @export
 * @interface IDgMetadata
 * @template T
 */
export interface IDgMetadata<T extends IEntity> {
  total: number;
  limit: number;
  page: number;
  pages: number;
  search: IDgFormValue;
  filters?: IDgFilterParam<T>;
}

/**
 *
 *
 * @export
 * @interface IDgOptions
 */
export interface IDgOptions {
  hasActionOverflow: boolean;
  hasExport: boolean;
  pageSizeOptions: number[];
}

/**
 *
 *
 * @export
 * @interface IDgFormOptions
 */
export interface IDgFormOptions {
  query?: boolean;
  createdAt?: boolean;
}

/**
 *
 *
 * @export
 * @interface IDgFormValue
 */
export interface IDgFormValue {
  query?: string;
  createdAt?: boolean;
}

/**
 *
 *
 * @export
 * @interface IDgFilterProp
 */
export interface IDgFilterProp<T extends IEntity> {
  property: keyof T;
  value: any;
}

/**
 *
 *
 * @export
 * @interface IDgFilterParam
 */
export interface IDgFilterParam<T extends IEntity> {
  [key: string]: any;
}

/**
 *
 *
 * @interface IDgNumericFilterAttributes
 */
export interface IDgNumericFilterAttributes {
  step?: number;
  min?: number;
  max?: number;
}
