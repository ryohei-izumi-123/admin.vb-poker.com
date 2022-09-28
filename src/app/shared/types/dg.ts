import { Observable } from 'rxjs';
import {
  IBaseEntity,
  IEntity,
  IPaginate,
  IPageable,
  IDgSort,
  IDgFilter,
  IDgFilterProp,
} from '@shared/interfaces';
import { BaseFilterComponent } from '@core/class/base-filter.component';

export type TDgSort<T> = {
  [P in keyof T]: IDgSort<any>;
};

export type TDgFilter<T> = {
  [P in keyof T]: IDgFilter<any>;
};

export type TBaseDataSource = (payload?: any) => Observable<any>;

export type TGenericDataSource<T> = (payload?: T) => Observable<T>;

export type TDataSourcePayload<T> = T | IPaginate<T>;

export type TRowDataSource<T extends IEntity> = (
  payload?: TDataSourcePayload<T>
) => Observable<T>;

export type TRowsDataSource<T extends IEntity> = (
  payload?: TDataSourcePayload<T>
) => Observable<IPageable<T>>;

export type TDataSource<T extends IBaseEntity = IBaseEntity> =
  | TBaseDataSource
  | TGenericDataSource<T>
  | TRowsDataSource<T>
  | TRowDataSource<T>;

export type TDgFilterProp<T extends IEntity> =
  | IDgFilterProp<T>
  | BaseFilterComponent<T>;
