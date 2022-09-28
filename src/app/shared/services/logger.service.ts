import { Injectable } from '@angular/core';
import { moment } from '@core/class/util';
import { _ } from '@core/class/util';
import { BaseService } from '@core/class/base.service';

export const LOG_BG_BLACK = 'background-color: black;';
export const LOG_COLOR_BLACK = 'color: black;';
export const LOG_BG_WHITE = 'background-color: white;';
export const LOG_COLOR_WHITE = 'color: white;';
export const LOG_BG_RED = 'background-color: red;';
export const LOG_COLOR_RED = 'color: red;';
export const LOG_BG_GREEN = 'background-color: green;';
export const LOG_COLOR_GREEN = 'color: green;';
export const LOG_BG_BLUE = 'background-color: blue;';
export const LOG_COLOR_BLUE = 'color: blue;';
export const LOG_BG_YELLOW = 'background-color: yellow;';
export const LOG_COLOR_YELLOW = 'color: yellow;';
export const LOG_BOLD = 'font-weight: bold;';
export const LOG_LARGE = 'font-size: xx-large;';
export const LOG_SMALL = 'font-size: xx-small;';

/**
 *
 */
type TLogLevel = 'info' | 'warn' | 'error' | 'log';

/**
 *
 */
type TLogFunc = (...args: any[]) => void;

/**
 *
 *
 * @abstract
 * @class BaseLoggerService
 */
abstract class BaseLoggerService {
  public abstract log: TLogFunc;
  public abstract info: TLogFunc;
  public abstract warn: TLogFunc;
  public abstract error: TLogFunc;
}

/**
 *
 *
 * @export
 * @class LoggerService
 * @extends {BaseService}
 * @implements {BaseLoggerService}
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService extends BaseService implements BaseLoggerService {
  /**
   * Creates an instance of LoggerService.
   *
   * @memberOf LoggerService
   */
  public constructor() {
    super();
  }

  /**
   *
   *
   * @readonly
   * @type {TLogFunc}
   * @memberof LoggerService
   */
  public get info(): TLogFunc {
    return this._log.bind(this, 'info');
  }

  /**
   *
   *
   * @readonly
   * @type {TLogFunc}
   * @memberof LoggerService
   */
  public get warn(): TLogFunc {
    return this._log.bind(this, 'warn');
  }

  /**
   *
   *
   * @readonly
   * @type {TLogFunc}
   * @memberof LoggerService
   */
  public get error(): TLogFunc {
    return this._log.bind(this, 'error');
  }

  /**
   *
   *
   * @private
   * @param {TLogLevel} type
   * @return {string}
   * @memberof LoggerService
   */
  private _getStyle(type: TLogLevel): string {
    return `${this._getBgStyle(type)}${this._getFontStyle(type)}${LOG_BOLD}`;
  }

  /**
   *
   * @private
   * @param {TLogLevel} type
   * @returns {string}
   * @memberof LoggerService
   */
  private _getIcon(type: TLogLevel): string {
    let style: string = '';
    switch (type) {
      case 'error':
        style = `⛔️`;
        break;

      case 'info':
        style = `ℹ️`;
        break;

      case 'warn':
        style = `⚠️`;
        break;

      case 'log':
      default:
        break;
    }
    return style;
  }

  /**
   *
   * @private
   * @param {TLogLevel} type
   * @returns {string}
   * @memberof LoggerService
   */
  private _getFontStyle(type: TLogLevel): string {
    let style: string = '';
    switch (type) {
      case 'error':
        style = LOG_COLOR_WHITE;
        break;

      case 'log':
      case 'info':
        style = LOG_COLOR_WHITE;
        break;

      case 'warn':
        style = LOG_COLOR_BLACK;
        break;

      default:
        break;
    }

    return style;
  }

  /**
   *
   * @private
   * @param {TLogLevel} type
   * @returns {string}
   * @memberof LoggerService
   */
  private _getBgStyle(type: TLogLevel): string {
    let style: string = '';
    switch (type) {
      case 'error':
        style = LOG_BG_RED;
        break;

      case 'log':
      case 'info':
        style = LOG_BG_BLUE;
        break;

      case 'warn':
        style = LOG_BG_YELLOW;
        break;

      default:
        break;
    }

    return style;
  }

  /**
   *
   * @private
   * @param {TLogLevel} type
   * @param {...any[]} args
   * @memberof LoggerService
   */
  private _log(type: TLogLevel, ...args: any[]): void {
    const logger: TLogFunc = console[type] || console.log;
    const style: string = `%c`;
    if (_.size(args)) {
      args.unshift(`[${moment().clone().toISOString()}]`);
      args.unshift(this._getStyle(type));
      args.unshift(`${style}${this._getIcon(type)}${_.toUpper(type)}:`);
    }

    return logger.apply(console, args);
  }

  /**
   *
   *
   * @param {TLogLevel} type
   * @param {...any[]} args
   * @return {void}
   * @memberof LoggerService
   */
  public log(type: TLogLevel, ...args: any[]): void {
    return this._log.apply(type, args);
  }
}
