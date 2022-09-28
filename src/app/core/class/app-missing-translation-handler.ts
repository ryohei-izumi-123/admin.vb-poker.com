import { environment } from '@env/environment';
import { Inject, Injectable } from '@angular/core';
import {
  MissingTranslationHandler,
  MissingTranslationHandlerParams,
} from '@ngx-translate/core';
import { LoggerService } from '@shared/services/logger.service';
/**
 *
 *
 * @export
 * @class AppMissingTranslationHandler
 * @implements {MissingTranslationHandler}
 */
@Injectable()
export class AppMissingTranslationHandler implements MissingTranslationHandler {
  public constructor(
    @Inject(LoggerService) private _loggerSvc: LoggerService
  ) {}
  /**
   *
   *
   * @private
   * @type {string[]}
   * @memberof AppMissingTranslationHandler
   */
  private _keys: string[] = [];

  /**
   *
   *
   * @param {MissingTranslationHandlerParams} params
   * @return {string}
   * @memberof AppMissingTranslationHandler
   */
  public handle(params: MissingTranslationHandlerParams): string {
    this._keys.push(params.key);
    if (!environment.production) {
      this._loggerSvc.warn(`[Translation Failed]:${params.key} is missing.`);
    }

    return params.key;
  }
}
