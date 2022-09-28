import { TIso6391, TScope } from '@shared/types';
import { IEntity } from './entity';
import { ErrorObject as AjvErrorObject } from 'ajv';
/**
 *
 *
 * @export
 * @interface ILanguage
 * @extends {IEntity}
 */
export interface ILanguage extends IEntity {
  scope?: TScope;
  locale?: TIso6391;
  i18N?: any;
}

/**
 *
 *
 * @export
 * @interface ILanguageSchemaValidateResult
 */
export interface ILanguageSchemaValidateResult {
  isValid: boolean;
  errors?: AjvErrorObject[];
  errorsText?: string;
  errorsAt?: string;
}
