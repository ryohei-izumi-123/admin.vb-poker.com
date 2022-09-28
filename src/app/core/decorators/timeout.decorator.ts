// tslint:disable:only-arrow-functions
import { _ } from '@core/class/util';

/**
 *
 *
 * @export
 * @param {number} [ms=1000]
 * @returns {MethodDecorator}
 */
export function Timeout(ms: number = 1000): MethodDecorator {
  return function (
    target: any,
    key: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const original: any = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (_.isFunction(original)) {
        _.delay(original, ms, args);
      }
    };

    return descriptor;
  };
}
