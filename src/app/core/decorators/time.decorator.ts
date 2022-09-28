// tslint:disable:only-arrow-functions
// tslint:disable:ban-types
// tslint:disable:no-console
import { _ } from '@core/class/util';

/**
 *
 *
 * @export
 * @param {('log'|'warn'|'info'|'error'|'debug')} [level='debug']
 * @returns {MethodDecorator}
 */
export function Time(
  level: 'log' | 'warn' | 'info' | 'error' | 'debug' = 'debug'
): MethodDecorator {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const logger: () => any = console[level].bind(console);
    const original: any = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const start: number = performance.now();
      original.apply(this, args);
      const stop: number = performance.now();
      if (_.isFunction(logger)) {
        logger(`[PERFORMANCE STATS]:`, (stop - start).toFixed(2));
      }
    };

    return descriptor;
  };
}
