import * as Parser from 'url-parse';
import { IUrlSchema } from '@shared/interfaces';

/**
 *
 *
 * @export
 * @class UrlParser
 */
export class UrlParser {
  /**
   *
   * @static
   * @param {string} url
   * @param {boolean} [isDeep=true]
   * @returns {IUrlSchema}
   * @memberof UrlParser
   */
  public static parse(url: string, isDeep: boolean = true): IUrlSchema {
    return Parser(url, isDeep) as IUrlSchema;
  }
}
