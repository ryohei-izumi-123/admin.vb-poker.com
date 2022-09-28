import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Observable,
  of as of$,
  throwError as throwError$,
  from as fromPromise$,
} from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { BaseService } from '@core/class/base.service';
import { LoggerService } from '@shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class LoadScriptService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {string[]>}
   * @memberof LoadScriptService
   */
  private _scripts: string[] = [];

  /**
   * Creates an instance of LoadScriptService.
   * @param {LoggerService} _loggerSvc
   * @param {Document} _document
   * @memberof LoadScriptService
   */
  public constructor(
    @Inject(LoggerService) private _loggerSvc: LoggerService,
    @Inject(DOCUMENT) private _document: Document
  ) {
    super();
    this.init();
  }

  /**
   *
   *
   * @param {string} src
   * @return {Observable<string>}
   * @memberof LoadScriptService
   */
  public load$(src: string): Observable<string> {
    const found: string = this._scripts.find((s: string) => s === src);
    if (found) {
      return of$(found);
    }

    return fromPromise$(this._load(src)).pipe(
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @param {string} src
   * @return {Promise<string>}
   * @memberof LoadScriptService
   */
  private _load(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const $script: HTMLScriptElement = this._document.createElement('script');
      $script.src = src;
      $script.type = 'text/javascript';
      $script.async = true;
      $script.onload = () => {
        this._loggerSvc.info(
          `[LoadScriptService]: script ${src} was successfully loaded.`
        );
        this._scripts.push(src);
        return resolve(src);
      };

      $script.onerror = () => {
        this._loggerSvc.error(
          `[LoadScriptService]: failed to load script ${src}.`
        );
        return reject(src);
      };

      const [$head]: HTMLHeadElement[] = Array.from(
        this._document.getElementsByTagName('head')
      );
      if ($head) {
        $head.appendChild($script);
      }
    });
  }

  /**
   *
   *
   * @return {void}
   * @memberof LoadScriptService
   */
  public init(): void {}

  /**
   *
   *
   * @memberof LoadScriptService
   */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
