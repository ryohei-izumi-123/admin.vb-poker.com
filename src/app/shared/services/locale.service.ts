import { environment } from '@env/environment';
import {
  LOCALE_ID,
  Inject,
  Injectable,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { _ } from '@core/class/util';
import { moment } from '@core/class/util';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  take,
  map,
  concatMap,
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ClrCommonStrings, ClrCommonStringsService } from '@clr/angular';
import { APP_LANGUAGE_TOKEN, toTokenize } from '@shared/tokens';
import { LoggerService } from '@shared/services/logger.service';
import { LanguageService } from '@shared/services/language.service';
import { StorageService } from '@shared/services/storage.service';
import { ApiService } from '@shared/services/api.service';
import { BaseService } from '@core/class/base.service';
import { TIso6391 } from '@shared/types';
// import { IIso6391 } from '@shared/interfaces';

/**
 *
 *
 * @export
 * @class LocaleService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class LocaleService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {EventEmitter<boolean>}
   * @memberof LocaleService
   */
  private _i18nReady$: EventEmitter<boolean> = new EventEmitter<boolean>(null);

  /**
   *
   *
   * @type {Observable<any>}
   * @memberof LocaleService
   */
  public i18nReady$: Observable<any> = this._i18nReady$.asObservable().pipe(
    distinctUntilChanged(),
    filter((ready: boolean) => _.isBoolean(ready))
  );

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof LocaleService
   */
  private _clrPrefix: string = 'clr';

  /**
   *
   *
   * @private
   * @type {TIso6391[]}
   * @memberof LocaleService
   */
  private _locales: TIso6391[] = ['en', 'ja'];

  /**
   *
   *
   * @readonly
   * @type {TIso6391[]}
   * @memberof LocaleService
   */
  public get locales(): TIso6391[] {
    return this._locales;
  }

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof LocaleService
   */
  public set locale(locale: TIso6391) {
    this._localeSubject.next(locale);
  }

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof LocaleService
   */
  public get locale(): TIso6391 {
    return this._localeSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<TIso6391>}
   * @memberof LocaleService
   */
  private _localeSubject: BehaviorSubject<TIso6391> = new BehaviorSubject<TIso6391>(
    null
  );

  /**
   *
   *
   * @type {Observable<TIso6391>}
   * @memberof LocaleService
   */
  public locale$: Observable<TIso6391> = this._localeSubject
    .asObservable()
    .pipe(
      filter((locale: TIso6391) => locale !== null),
      distinctUntilChanged()
    );

  /**
   * Creates an instance of LocaleService.
   * @param {ApiService} _apiSvc
   * @param {StorageService} _storageSvc
   * @param {LoggerService} _loggerSvc
   * @param {TranslateService} _translateSvc
   * @param {ClrCommonStringsService} _clrCommonStringsSvc
   * @param {Document} _document
   * @param {TIso6391} _localeId
   * @memberof LocaleService
   */
  public constructor(
    @Inject(ApiService) private _apiSvc: ApiService,
    @Inject(StorageService) private _storageSvc: StorageService,
    @Inject(LoggerService) private _loggerSvc: LoggerService,
    @Inject(TranslateService) private _translateSvc: TranslateService,
    @Inject(ClrCommonStringsService)
    private _clrCommonStringsSvc: ClrCommonStringsService,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(LOCALE_ID) private _localeId: TIso6391
  ) {
    super();
  }

  /**
   *
   *
   * @memberof LocaleService
   */
  public ngOnDestroy() {
    this._i18nReady$.complete();
    this._localeSubject.complete();
  }

  /**
   *
   *
   * @private
   * @param {TIso6391} locale
   * @return {TIso6391}
   * @memberof LocaleService
   */
  private _normalize(locale: TIso6391): TIso6391 {
    return _.toString(locale).slice(0, 2) as TIso6391;
  }

  /**
   *
   *
   * @return {TIso6391}
   * @memberof LocaleService
   */
  public getDefault(): TIso6391 {
    return this._normalize(
      this._storageSvc.get(toTokenize(APP_LANGUAGE_TOKEN)) ||
        _.get(window.navigator, 'userLanguage') ||
        _.get(window.navigator, 'language') ||
        'ja'
    );
  }

  /**
   *
   *
   * @memberof LocaleService
   */
  public init(): void {
    this.locale$
      .pipe(
        filter((value: TIso6391) => value !== null),
        distinctUntilChanged()
      )
      .subscribe(this.setLanguage.bind(this));

    this.locale = this.getDefault();
  }

  /**
   *
   *
   * @private
   * @returns {Observable<ClrCommonStrings>}
   * @memberof LocaleService
   */
  private getClrLocales$(): Observable<ClrCommonStrings> {
    const prefix: string = `/${environment.api.endpoint.api}/languages/`;
    const suffix: string = '';
    const url: string = `${prefix}${this.locale}${suffix}`;

    return this._apiSvc.get(url).pipe(
      map((i18n: any) => _.get(i18n, this._clrPrefix)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @param {ClrCommonStrings} locales
   * @memberof LocaleService
   */
  private setClrLocales(locales: ClrCommonStrings): void {
    this._clrCommonStringsSvc.localize(locales);
    this._i18nReady$.emit(true);
  }

  /**
   *
   *
   * @readonly
   * @type {TIso6391}
   * @memberof LocaleService
   */
  private setLanguage(locale: TIso6391): void {
    const $document: HTMLElement = this._document.documentElement;
    this.locale = locale;
    this._localeId = locale;
    $document.lang = this._localeId;
    moment.locale(this._localeId);
    this._storageSvc.set(toTokenize(APP_LANGUAGE_TOKEN), locale);
    this._translateSvc.setDefaultLang(this._localeId);

    this._subscription.add(
      this._translateSvc
        .use(this._localeId)
        .pipe(
          concatMap(() => this.getClrLocales$()),
          filter((value: ClrCommonStrings) => value !== null),
          distinctUntilChanged()
        )
        .subscribe(this.setClrLocales.bind(this))
    );

    this._loggerSvc.info(
      this._localeId,
      this._translateSvc.getBrowserCultureLang(),
      this._translateSvc.getBrowserLang(),
      this._translateSvc.getDefaultLang(),
      this._translateSvc.currentLang,
      this._translateSvc.getLangs()
    );
  }
}
