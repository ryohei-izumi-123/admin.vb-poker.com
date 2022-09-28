import { IEntity } from './entity';
import { TRole } from '@shared/types/role';
import { TAclAction, TAclPossession } from '@shared/types/acl';

/**
 *
 *
 * @export
 * @interface IAcl
 * @extends {IEntity}
 */
export interface IAcl extends IEntity {
  role?: TRole;
  permissions?: IAclPermission[];
}

/**
 *
 *
 * @export
 * @interface IAclPermission
 */
export interface IAclPermission {
  resource: string;
  crud: IAclCrud[];
}

/**
 *
 *
 * @export
 * @interface IAclCrud
 */
export interface IAclCrud {
  action: TAclAction;
  value: boolean;
}

export interface IAclRolePermission {
  role?: TRole;
  resource?: string;
  action?: TAclAction;
}
