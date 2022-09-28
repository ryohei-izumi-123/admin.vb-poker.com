import { IAcl } from './acl';
import { IEntity } from './entity';
import { ICountry } from './country';
import { TUserRole } from '@shared/types/role';

/**
 *
 *
 * @export
 * @interface IUser
 * @extends {IEntity}
 */
export interface IUser extends IEntity {
  role?: TUserRole;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  countryId?: number;
  country?: ICountry;
  ipAddress?: string;
  userAgent?: string;
  fingerPrint?: string;
  lastLogin?: string;
  failedLoginAttempt?: string;
  config?: IUserConfig;
  acl?: IAcl;
}

/**
 *
 *
 * @export
 * @interface IUserConfig
 */
export interface IUserConfig {
  security?: IUserConfigSecurity;
}
/**
 *
 *
 * @export
 * @interface IUserConfigSecurity
 */
export interface IUserConfigSecurity {
  method?: 'google' | null;
}
