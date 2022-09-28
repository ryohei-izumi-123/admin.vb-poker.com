import { environment } from '@env/environment';
import { Injector, Injectable, VERSION, Type } from '@angular/core';
import { of as of$, Observable, throwError as throwError$ } from 'rxjs';
import { tap, take, catchError, retry, filter, mergeMap } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { LoggerService } from '@shared/services/logger.service';
import { CountryService } from '@shared/services/country.service';
import { IconService } from '@shared/services/icon.service';
import { OptionService } from '@shared/services/option.service';
import { LocaleService } from '@shared/services/locale.service';
import { LanguageService } from '@shared/services/language.service';
import { ThemeService } from '@shared/services/theme.service';
import { ICountry } from '@shared/interfaces/country';
import { IOption } from '@shared/interfaces/option';

/**
 *
 *
 * @see https://www.intertech.com/Blog/angular-4-tutorial-run-code-during-app-initialization/
 * @description アプリ起動前に実行しておきたい処理を登録する。app.moduleのbootstrapでAPP_INITIALIZERとして登録している。
 * @export
 * @class AppInitializer
 */
@Injectable({
  providedIn: 'root',
})
export class AppInitializer {
  /**
   *
   *
   * @private
   * @type {number}
   * @memberof AppInitializer
   */
  private _retry: number = 1;

  /**
   *Creates an instance of AppInitializer.
   * @param {Injector} _injector
   * @memberof AppInitializer
   */
  public constructor(private _injector: Injector) {}

  /**
   *
   *
   * @private
   * @template T
   * @param {Type<T>} type
   * @return {T}
   * @memberof AppInitializer
   */
  private getService<T>(type: Type<T>): T {
    return this._injector.get(type);
  }

  /**
   *
   *
   * @readonly
   * @private
   * @type {LoggerService}
   * @memberof AppInitializer
   */
  private get _loggerSvc(): LoggerService {
    return this.getService<LoggerService>(LoggerService);
  }

  /**
   *
   * @returns {Observable<ICountry[]>}
   * @memberof AppInitializer
   */
  private initCountryService$(): Observable<ICountry[]> {
    const _svc: CountryService = this.getService<CountryService>(
      CountryService
    );

    return _svc.getAll$().pipe(
      retry(this._retry),
      tap((response: ICountry[]) => (_svc.data = response)),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   * @returns {Observable<IOption>}
   * @memberof AppInitializer
   */
  private initOptionService$(): Observable<IOption> {
    const _svc: OptionService = this.getService<OptionService>(OptionService);

    return _svc.getOption$().pipe(
      retry(this._retry),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @return {Observable<boolean>}
   * @memberof AppInitializer
   */
  private initLocaleService$(): Observable<boolean> {
    const _svc: LocaleService = this.getService<LocaleService>(LocaleService);
    _svc.init();

    return _svc.i18nReady$.pipe(
      filter((ready: boolean) => ready),
      take(1)
    );
  }

  /**
   *
   *
   * @returns {Promise<any>}
   * @memberof AppInitializer
   */
  public init(): Promise<any> {
    const app: string = `🎰 ${environment.name} v${environment.version}/${VERSION.full} 🎲`;
    if (!environment.production) {
      this._loggerSvc.info(app);
    }

    this.getService<IconService>(IconService).init();
    this.getService<ThemeService>(ThemeService).init();
    this.getService<LanguageService>(LanguageService).init();

    return of$(app)
      .pipe(
        mergeMap(() => this.initCountryService$()),
        mergeMap(() => this.initOptionService$()),
        mergeMap(() => this.initLocaleService$())
      )
      .toPromise();
  }
}

export const AppInitializerFactory = (initializer: AppInitializer) => {
  return () => initializer.init();
};
