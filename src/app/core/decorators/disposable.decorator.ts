// tslint:disable:only-arrow-functions
// tslint:disable:ban-types
import { _ } from '@core/class/util';
const doUnsubscribe = (subscription: any) => {
  if (!_.isEmpty(subscription)) {
    if (_.isFunction(subscription.unsubscribe)) {
      subscription.unsubscribe();
    }

    if (_.isFunction(subscription.complete)) {
      subscription.complete();
    }

    if (
      _.isFunction(subscription.detach) &&
      _.isFunction(subscription.markForCheck) &&
      _.isFunction(subscription.detectChanges)
    ) {
      subscription.detach();
    }
  }
};
const doUnsubscribeIfArray = (subscriptionsArray: any) => {
  if (_.isArray(subscriptionsArray)) {
    subscriptionsArray.forEach(doUnsubscribe);
  }
};

/**
 *
 *
 * @export
 * @param {({
 *   ignores?: any[];
 *   name?: string;
 *   hook: 'ngOnInit'|'ngOnChanges'|'ngOnDestroy'|'ngDoCheck'|'ngAfterContentInit'|'ngAfterContentChecked'|'ngAfterViewInit'|'ngAfterViewChecked';
 * })} [{ ignores = [], name = '', hook = 'ngOnDestroy' }={
 *   ignores: [],
 *   name: '',
 *   hook: 'ngOnDestroy'
 * }]
 * @returns
 */
export function Disposable(
  {
    ignores = [],
    name = '',
    hook = 'ngOnDestroy',
  }: {
    ignores?: any[];
    name?: string;
    hook:
      | 'ngOnInit'
      | 'ngOnChanges'
      | 'ngOnDestroy'
      | 'ngDoCheck'
      | 'ngAfterContentInit'
      | 'ngAfterContentChecked'
      | 'ngAfterViewInit'
      | 'ngAfterViewChecked';
  } = {
    ignores: [],
    name: '',
    hook: 'ngOnDestroy',
  }
) {
  return function (constructor: () => any) {
    const original: any = constructor.prototype[hook];
    if (!_.isFunction(original)) {
      throw new TypeError(
        `${constructor.name} called @Unsubscribe decorator but does not have ${hook} implementation!`
      );
    }

    constructor.prototype[hook] = function () {
      if (_.isFunction(original)) {
        original.apply(this, arguments);
      }

      if (name) {
        doUnsubscribeIfArray(this[name]);
        return;
      }

      for (const prop in this) {
        if (_.isArray(ignores) && ignores.includes(prop)) {
          continue;
        }

        const property: any = this[prop];
        doUnsubscribe(property);
      }
    };
  };
}
