import { CustomError } from 'ts-custom-error';

/**
 *
 *
 * @class AppError
 * @extends {CustomError}
 */
export class AppError extends CustomError {
  /**
   *Creates an instance of AppError.
   * @param {string} message
   * @param {string} title
   * @param {number} status
   * @memberof AppError
   */
  public constructor(
    public message: string,
    public title: string = '',
    public status: number = 500
  ) {
    super(message);
  }
}
