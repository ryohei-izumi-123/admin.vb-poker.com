/**
 *
 *
 * @export
 * @interface ISocialUser
 */
export interface ISocialUser {
  providerId: string;
  id: string;
  email: string;
  name: string;
  photo: string;
  firstName: string;
  lastName: string;
  authToken: string;
  idToken?: string; // Reference https://developers.google.com/identity/sign-in/web/backend-auth
  authCode?: string; // Reference https://developers.google.com/identity/sign-in/web/reference#googleauthgrantofflineaccessoptions
  rawData: any;
}
/**
 *
 *
 * @export
 * @interface ISocialLoginStatusOptions
 */
export interface ISocialLoginStatusOptions {
  refreshToken?: boolean;
}
/**
 *
 *
 * @export
 * @interface ISocialLoginOptions
 */
export interface ISocialLoginOptions {
  fields?: boolean;
}
