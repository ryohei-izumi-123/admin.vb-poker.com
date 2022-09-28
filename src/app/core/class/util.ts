// import * as _ from 'lodash-es';
import get from 'lodash-es/get';
import has from 'lodash-es/has';
import set from 'lodash-es/set';
import unset from 'lodash-es/unset';
import remove from 'lodash-es/remove';
import split from 'lodash-es/split';
import isArray from 'lodash-es/isArray';
import isString from 'lodash-es/isString';
import isBoolean from 'lodash-es/isBoolean';
import isNaN from 'lodash-es/isNaN';
import isNumber from 'lodash-es/isNumber';
import isNull from 'lodash-es/isNull';
import isUndefined from 'lodash-es/isUndefined';
import isEmpty from 'lodash-es/isEmpty';
import isError from 'lodash-es/isError';
import isObject from 'lodash-es/isObject';
import isObjectLike from 'lodash-es/isObjectLike';
import isRegExp from 'lodash-es/isRegExp';
import isFunction from 'lodash-es/isFunction';
import keys from 'lodash-es/keys';
import map from 'lodash-es/map';
import assign from 'lodash-es/assign';
import clone from 'lodash-es/clone';
import cloneDeep from 'lodash-es/cloneDeep';
import pickBy from 'lodash-es/pickBy';
import identity from 'lodash-es/identity';
import size from 'lodash-es/size';
import toString from 'lodash-es/toString';
import toNumber from 'lodash-es/toNumber';
import toJSON from 'lodash-es/toJSON';
import toUpper from 'lodash-es/toUpper';
import toLower from 'lodash-es/toLower';
import toArray from 'lodash-es/toArray';
import delay from 'lodash-es/delay';
import throttle from 'lodash-es/throttle';
import debounce from 'lodash-es/debounce';
import unescape from 'lodash-es/unescape';
import bind from 'lodash-es/bind';
import flatten from 'lodash-es/flatten';
import flattenDeep from 'lodash-es/flattenDeep';
import flatMapDeep from 'lodash-es/flatMapDeep';
import * as Moment from 'moment';
import { BigNumber } from 'bignumber.js';
import { NgZone } from '@angular/core';
import {
  MonoTypeOperatorFunction,
  Operator,
  Observable,
  TeardownLogic,
  Observer,
} from 'rxjs';
import { map as rxMap } from 'rxjs/operators';

export const bigNumber = BigNumber;
export const moment = Moment;
export const _ = {
  get,
  has,
  set,
  unset,
  remove,
  split,
  isArray,
  isString,
  isBoolean,
  isNaN,
  isNumber,
  isNull,
  isUndefined,
  isEmpty,
  isError,
  isObject,
  isObjectLike,
  isRegExp,
  isFunction,
  keys,
  map,
  assign,
  clone,
  cloneDeep,
  pickBy,
  identity,
  size,
  toString,
  toNumber,
  toJSON,
  toUpper,
  toLower,
  toArray,
  delay,
  throttle,
  debounce,
  unescape,
  bind,
  flatten,
  flattenDeep,
  flatMapDeep,
};
export const lodash = _;

/**
 *
 *
 * @export
 * @class Util
 */
export class Util {
  /**
   *
   *
   * @static
   * @param {*} value
   * @param {(key: string, value: any) => any} [replacer=null]
   * @param {number} [space=4]
   * @return {string}
   * @memberof Util
   */
  static toJson(
    value: any,
    replacer: (key: string, value: any) => any = null,
    space: number = 4
  ): string {
    return JSON.stringify(value, replacer, space);
  }

  /**
   *
   *
   * @param {*} value
   * @return {any}
   * @memberof Util
   */
  static fromJson(value: any): any {
    try {
      if (_.isObjectLike(value)) {
        value = JSON.stringify(value);
      }

      return JSON.parse(value);
    } catch (error) {
      return undefined;
    }
  }

  /**
   *
   *
   * @static
   * @param value
   * @return {boolean}
   * @memberof Util
   */
  static isJson(value: any): boolean {
    try {
      if (_.isObjectLike(value)) {
        value = JSON.stringify(value);
      }

      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }
}

/**
 *
 * @example `interval(1).pipe(zonefree(this._ngZone),filter((s: number) => s),zonefull(this._ngZone)).subscribe();`
 * @class NgZoneFreeOperator
 * @implements {Operator<T, T>}
 * @template T
 */
class NgZoneFreeOperator<T> implements Operator<T, T> {
  /**
   * Creates an instance of NgZoneFreeOperator.
   * @param {NgZone} _ngZone
   * @memberof NgZoneFreeOperator
   */
  public constructor(private readonly _ngZone: NgZone) {}
  /**
   *
   *
   * @param {Observer<T>} observer
   * @param {Observable<T>} source
   * @return {TeardownLogic}
   * @memberof NgZoneFreeOperator
   */
  public call(observer: Observer<T>, source: Observable<T>): TeardownLogic {
    return this._ngZone.runOutsideAngular(() => source.subscribe(observer));
  }
}

export const zonefull = <T>(zone: NgZone): MonoTypeOperatorFunction<T> => {
  return rxMap((value) => zone.run(() => value));
};

export const zonefree = <T>(zone: NgZone): MonoTypeOperatorFunction<T> => {
  return (source) => source.lift(new NgZoneFreeOperator(zone));
};
