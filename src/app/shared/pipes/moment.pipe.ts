import { Pipe, PipeTransform } from '@angular/core';
import { moment } from '@core/class/util';
import { _ } from '@core/class/util';

/**
 *
 *
 * @export
 * @class MomentPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'moment',
})
export class MomentPipe implements PipeTransform {
  /**
   *
   *
   * @param {moment.MomentInput} value
   * @param {string} [format='YYYY-MM-DD HH:mm:ss']
   * @returns {string}
   * @memberof MomentPipe
   */
  public transform(
    value: moment.MomentInput,
    format: string = 'YYYY-MM-DD HH:mm:ss'
  ): string {
    if (_.isNull(value) || _.isUndefined(value)) {
      value = new Date();
    }

    if (_.isString(value)) {
      value = new Date(value);
    }

    return moment(value).format(format);
  }
}
