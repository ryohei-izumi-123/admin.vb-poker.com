import { IEntity } from './entity';
import { ICountry } from './country';
import { TCustomerRole } from '@shared/types/role';

/**
 *
 *
 * @export
 * @interface ICustomer
 */
export interface ICustomer extends IEntity {
  role?: TCustomerRole;
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
  config?: any;
  remarks?: string;
}
