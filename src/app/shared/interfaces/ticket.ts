import { IEntity } from './entity';
import { IUser } from './user';
import { TTicketInquiryType } from '@shared/types/role';

/**
 *
 *
 * @export
 * @interface ITicket
 * @extends {IEntity}
 */
export interface ITicket extends IEntity {
  userId?: number;
  user?: IUser;
  inquiryType?: TTicketInquiryType;
  title?: string;
  detail?: string;
  img?: string;
}
