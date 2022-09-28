import { IEntity } from './entity';

/**
 *
 *
 * @export
 * @interface ITreeRouteDataRows
 * @template T
 */
export interface ITreeRouteDataRows<T extends IEntity> {
  nodes: T[];
}
