import { IEntity } from './entity';
import { IProduct } from './product';
import { IUser } from './user';
import { ICurrency } from './currency';

/**
 *
 *
 * @export
 * @interface IOrder
 * @extends {IEntity}
 */
export interface IOrder extends IEntity {
  productId?: number;
  product?: IProduct;
  userId?: number;
  user?: IUser;
  currencyId?: number;
  currency?: ICurrency;
  amount?: number;
  txPrice?: number;
}
