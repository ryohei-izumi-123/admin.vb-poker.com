import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '@core/class/util';
import * as _ from 'lodash';

/**
 *
 *
 * @export
 * @class PrettifyJsonPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'json',
})
export class PrettifyJsonPipe implements PipeTransform {
  /**
   *Creates an instance of PrettifyJsonPipe.
   * @param {TranslateService} _translateSvc
   * @memberof PrettifyJsonPipe
   */
  public constructor() {}

  /**
   *
   *
   * @param {*} value
   * @param {*} [args=4]
   * @return {string}
   * @memberof PrettifyJsonPipe
   */
  public transform(value: any, args: any = 4): string {
    if (_.isString(value)) {
      const json: any = Util.fromJson(value);
      if (_.isObjectLike(json)) {
        value = json;
      }
    }

    return Util.toJson(value, null, args);
  }
}
