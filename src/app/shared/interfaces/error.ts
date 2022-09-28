import { moment } from '@core/class/util';

/**
 *
 *
 * @export
 * @interface IErrorLike
 * @extends {Error}
 */
export interface IErrorLike extends Error {
  originalError?: IErrorLike | Error;
}

/**
 *
 *
 * @export
 * @interface IError
 */
export interface IError {
  error: IErrorDetail;
}

/**
 *
 *
 * @export
 * @interface IErrorDetail
 */
export interface IErrorDetail {
  stackTrace: string;
  url: string;
  message: string;
  date: moment.MomentInput;
}
