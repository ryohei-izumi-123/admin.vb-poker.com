// tslint:disable:only-arrow-functions
// tslint:disable:ban-types
// tslint:disable:no-console
import { _ } from '@core/class/util';

function _memoize(fn: any) {
  return function () {
    const args: any = Array.prototype.slice.call(arguments);
    fn.cached = fn.cached || {};
    return fn.cached[args]
      ? fn.cached[args]
      : (fn.cached[args] = fn.apply(this, args));
  };
}

/**
 *
 *
 * @export
 * @returns {MethodDecorator}
 */
export function Memoize(): MethodDecorator {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const src: any = descriptor.value;
    const dist: any = _memoize(src);
    descriptor.value = function () {
      return dist.apply(this, arguments);
    };

    return descriptor;
  };
}
