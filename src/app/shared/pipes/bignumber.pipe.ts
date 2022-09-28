import { Pipe, PipeTransform } from '@angular/core';
import { bigNumber as BigNumber } from '@core/class/util';

/**
 *
 *
 * @export
 * @class BignumberPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'bignumber',
})
export class BignumberPipe implements PipeTransform {
  /**
   *
   *
   * @param {(number|string)} value
   * @param {number} [args=2]
   * @returns {string}
   * @memberof BignumberPipe
   */
  public transform(value: number | string, args: number = 2): string {
    return new BigNumber(value).toFixed(args);
  }
}
