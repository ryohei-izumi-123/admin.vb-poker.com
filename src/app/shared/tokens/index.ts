import { InjectionToken } from '@angular/core';
import { ISocketOptions } from '@shared/interfaces/socket';
import { Ajv } from 'ajv';

/**
 *
 * @param token
 */
export const toTokenize = (token: InjectionToken<string>) =>
  `${token}`.replace('InjectionToken', '').trim();

/**
 *  @description jwt token key
 */
export const APP_AUTH_TOKEN: InjectionToken<string> = new InjectionToken<string>(
  'APP_AUTH_TOKEN'
);

/**
 *
 */
export const APP_REGISTER_ENTITY_TOKEN: InjectionToken<string> = new InjectionToken<string>(
  'APP_REGISTER_ENTITY_TOKEN'
);

/**
 *
 */
export const APP_LOGIN_CREDENTIALS: InjectionToken<string> = new InjectionToken<string>(
  'APP_LOGIN_CREDENTIALS'
);

/**
 *
 */
export const APP_LANGUAGE_TOKEN: InjectionToken<string> = new InjectionToken<string>(
  'APP_LANGUAGE_TOKEN'
);

/**
 *
 */
export const APP_CURRENCY_TOKEN: InjectionToken<string> = new InjectionToken<string>(
  'APP_CURRENCY_TOKEN'
);

/**
 *
 */
export const RECAPTCHA_URL: InjectionToken<string> = new InjectionToken(
  'RECAPTCHA_URL'
);

/**
 *  @description add to home ios
 */
export const APP_ADD_TO_HOME_IOS: InjectionToken<string> = new InjectionToken<string>(
  'APP_ADD_TO_HOME_IOS'
);

/**
 *
 */
export const APP_THEME_TOKEN: InjectionToken<string> = new InjectionToken<string>(
  'APP_THEME_TOKEN'
);

/**
 *
 */
export const APP_TOUR_TOKEN: InjectionToken<string> = new InjectionToken<string>(
  'APP_TOUR_TOKEN'
);

/**
 *
 */
export const AJV_INSTANCE = new InjectionToken<Ajv>('AJV_INSTANCE');

/**
 *
 */
export const AJV_CLASS = new InjectionToken<Ajv>('AJV_CLASS');

/**
 *
 */
export const AJV_CONFIG = new InjectionToken<Ajv>('AJV_CONFIG');

/**
 *
 */
export const SOCKET_OPTIONS = new InjectionToken<ISocketOptions>(
  'SOCKET_OPTIONS'
);
