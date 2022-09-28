import { IEntity } from './entity';

/**
 *
 *
 * @export
 * @interface ICurrency
 */
export interface ICurrency extends IEntity {
  name: string;
  symbol: string;
}
