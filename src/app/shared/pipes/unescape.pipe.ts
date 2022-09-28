import { Pipe, PipeTransform } from '@angular/core';
import { _ } from '@core/class/util';

/**
 *
 * @usage `[innerHTML]="text|safe"`
 * @export
 * @class UnescapePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'unescape',
})
export class UnescapePipe implements PipeTransform {
  /**
   *Creates an instance of UnescapePipe.
   * @memberof UnescapePipe
   */
  public constructor() {}

  /**
   *
   *
   * @param {string} value
   * @param {any} args
   * @returns {string}
   * @memberof UnescapePipe
   */
  public transform(value: string, args?: any): string {
    return _.unescape(value);
  }
}
