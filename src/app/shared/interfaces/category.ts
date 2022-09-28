import { IEntity } from './entity';

/**
 *
 *
 * @export
 * @interface ICategory
 */
export interface ICategory extends IEntity {
  name?: string;
  img?: string | Blob;
}
