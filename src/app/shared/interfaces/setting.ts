import { IEntity } from './entity';
import { ICurrency } from './currency';

/**
 *
 *
 * @export
 * @interface ISetting
 * @extends {IEntity}
 */
export interface ISetting extends IEntity {
  name?: string;
  fee?: number;
  currencyId?: number;
  currency?: ICurrency;
  address?: string;
  config?: ISettingConfig;
}

/**
 *
 *
 * @export
 * @interface ISettingConfig
 */
export interface ISettingConfig {
  [key: string]: any;
}
