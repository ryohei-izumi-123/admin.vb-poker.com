import { IEntity } from './entity';
import { ICategory } from './category';
import { ICountry } from './country';
import { IProduct } from './product';
import { ICurrency } from './currency';
import { ICustomer } from './customer';
import { IUser } from './user';

/**
 *
 *
 * @export
 * @interface IOption
 * @extends {IEntity}
 */
export interface IOption extends IEntity {
  categories: ICategory[];
  countries: ICountry[];
  products: IProduct[];
  currencies: ICurrency[];
  customers: ICustomer[];
  users: IUser[];
}
