import { IEntity } from './entity';

/**
 *
 *
 * @export
 * @interface IValidate
 */
export interface IValidate extends IEntity {
  [key: string]: any;
}

/**
 *
 *
 * @export
 * @interface IValidateUnique
 */
export interface IValidateUnique extends IEntity {
  model: string;
  field: string;
  value: string;
}

/**
 *
 *
 * @export
 * @interface IValidatePassword
 */
export interface IValidatePassword {
  password: string;
}
