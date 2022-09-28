import { IEntity } from './entity';

/**
 *
 *
 * @export
 * @interface IInquiry
 * @extends {IEntity}
 */
export interface IInquiry extends IEntity {
  inquiryType?: 'default';
  fullName?: string;
  email?: string;
  title?: string;
  detail?: string;
}
