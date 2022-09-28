// tslint:disable:only-arrow-functions
import { _ } from '@core/class/util';

/**
 *
 *
 * @export
 * @param {number} [ms=100]
 * @returns {MethodDecorator}
 */
export function Debounce(ms: number = 100): MethodDecorator {
  return function (
    target: any,
    key: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const original: any = descriptor.value;
    descriptor.value = _.debounce(original, ms);
    return descriptor;
  };
}
