import { IEntity } from './entity';
import { IUser } from './user';

/**
 *
 *
 * @export
 * @interface IAuth
 */
export interface IAuth extends IUser {
  accessToken?: string;
  method: 'google' | null;
}

/**
 *
 *
 * @export
 * @interface IAuthParam
 */
export interface IAuthParam extends Partial<IUser> {
  remember?: boolean;
}

/**
 *
 *
 * @export
 * @interface IAuthTotpParam
 */
export interface IAuthTotpParam extends IAuthParam {
  token?: string;
}

/**
 *
 *
 * @export
 * @interface IAuthQr
 * @extends {IAuth}
 */
export interface IAuthQr extends IAuth {
  qr: string | Blob;
}
