import { Injectable, OnDestroy } from '@angular/core';
import { _ } from '@core/class/util';
import { ngxCsv as NgxCsv } from 'ngx-csv/ngx-csv';
import { ICsvOptions } from '@shared/interfaces';
import { BaseService } from '@core/class/base.service';

/**
 *
 * @export
 * @class CsvService
 */
@Injectable({
  providedIn: 'root',
})
export class CsvService extends BaseService implements OnDestroy {
  /**
   * Creates an instance of CsvService.
   * @memberof CsvService
   */
  public constructor() {
    super();
  }

  /**
   *
   *
   * @private
   * @type {ICsvOptions}
   * @memberof CsvService
   */
  private readonly _defaultOptions: ICsvOptions = {
    title: '',
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: false,
    showTitle: false,
    useBom: true,
    noDownload: false,
    filename: undefined,
    headers: undefined,
  };

  /**
   *
   *
   * @readonly
   * @type {ICsvOptions}
   * @memberof CsvService
   */
  public get defaultOptions(): ICsvOptions {
    return _.pickBy(this._defaultOptions, _.identity) as ICsvOptions;
  }

  /**
   *
   *
   * @private
   * @template T
   * @param {T[]} items
   * @returns {(keyof T)[]}
   * @memberof CsvService
   */
  private _extractKeys<T>(items: T[]): (keyof T)[] {
    return Array.from(
      new Set([].concat(...items.map((item: T) => _.keys(item))))
    );
  }

  /**
   *
   *
   * @template T
   * @param {T[]} [items=[]]
   * @param {string} [filename='download']
   * @param {ICsvOptions} [options={}]
   * @returns {T[]}
   * @memberof CsvService
   */
  public generate<T>(
    items: T[] = [],
    filename: string = 'download',
    options: ICsvOptions = {}
  ): T[] {
    const headers: string[] =
      _.get(options, 'headers') || (this._extractKeys<T>(items) as string[]);
    options = _.assign(
      _.cloneDeep(this.defaultOptions),
      _.pickBy(options, _.identity)
    );
    options.filename = filename;
    options.headers = headers;

    const instance: NgxCsv = new NgxCsv(items, filename, options);
    return instance.data as T[];
  }
}
