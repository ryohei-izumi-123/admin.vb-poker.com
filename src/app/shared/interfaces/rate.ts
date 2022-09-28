import { IEntity } from './entity';
import { ICurrency } from './currency';

/**
 *
 *
 * @export
 * @interface IRate
 * @extends {IEntity}
 */
export interface IRate extends IEntity {
  currencyId?: number;
  currency?: ICurrency;
  source?: string;
  rate?: number;
}
