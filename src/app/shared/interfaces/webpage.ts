import { IEntity } from './entity';
import { TIso6391 } from '@shared/types/iso639-1';
import { TPageType } from '@shared/types/page-type';

/**
 *
 *
 * @export
 * @interface IWebpage
 * @extends {IEntity}
 */
export interface IWebpage extends IEntity {
  pageType?: TPageType;
  locale?: TIso6391;
  content?: string;
}
