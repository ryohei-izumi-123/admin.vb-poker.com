import { IEntity } from './entity';
import { ICategory } from './category';

/**
 *
 *
 * @export
 * @interface IProduct
 */
export interface IProduct extends IEntity {
  name?: string;
  categoryId?: number;
  category?: ICategory;
  price?: number;
  remarks?: string;
}
