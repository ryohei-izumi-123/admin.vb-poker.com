import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { APP_THEME_TOKEN, toTokenize } from '@shared/tokens';
import { StorageService } from '@shared/services/storage.service';
import { BaseService } from '@core/class/base.service';
import { TTheme } from '@shared/types';

/**
 *
 *
 * @export
 * @class ThemeService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {string}
   * @memberof ThemeService
   */
  private _suffix: string = '-theme';

  /**
   *
   *
   * @private
   * @type {TTheme[]}
   * @memberof ThemeService
   */
  private _themes: TTheme[] = ['light', 'dark'];

  /**
   *
   *
   * @readonly
   * @type {TTheme[]}
   * @memberof ThemeService
   */
  public get themes(): TTheme[] {
    return this._themes;
  }

  /**
   *
   *
   * @readonly
   * @type {TTheme}
   * @memberof ThemeService
   */
  public set theme(theme: TTheme) {
    this._themeSubject.next(theme);
  }

  /**
   *
   *
   * @readonly
   * @type {TTheme}
   * @memberof ThemeService
   */
  public get theme(): TTheme {
    return this._themeSubject.getValue();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<TTheme>}
   * @memberof ThemeService
   */
  private _themeSubject: BehaviorSubject<TTheme> = new BehaviorSubject<TTheme>(
    null
  );

  /**
   *
   *
   * @type {Observable<TTheme>}
   * @memberof ThemeService
   */
  public theme$: Observable<TTheme> = this._themeSubject.asObservable().pipe(
    filter((theme: TTheme) => theme !== null),
    distinctUntilChanged()
  );

  /**
   * Creates an instance of ThemeService.
   * @param {StorageService} _storageSvc
   * @param {Document} _document
   * @memberof ThemeService
   */
  public constructor(
    @Inject(StorageService) private _storageSvc: StorageService,
    @Inject(DOCUMENT) private _document: Document
  ) {
    super();
  }

  /**
   *
   *
   * @memberof ThemeService
   */
  public ngOnDestroy() {
    this._themeSubject.complete();
  }

  /**
   *
   *
   * @memberof ThemeService
   */
  public init(): void {
    this.theme$
      .pipe(
        filter((value: TTheme) => value !== null),
        distinctUntilChanged()
      )
      .subscribe(this.setTheme.bind(this));

    const theme: TTheme =
      this._storageSvc.get(toTokenize(APP_THEME_TOKEN)) || 'dark';
    this.theme = theme;
  }

  /**
   *
   *
   * @private
   * @param {TTheme} theme
   * @return {{string}
   * @memberof ThemeService
   */
  private _classify(theme: TTheme): string {
    return `${theme}${this._suffix}`;
  }

  /**
   *
   *
   * @private
   * @param {TTheme} theme
   * @memberof ThemeService
   */
  private setTheme(theme: TTheme) {
    this.resetTheme();
    this.theme = theme;
    this._storageSvc.set(toTokenize(APP_THEME_TOKEN), theme);
    this._document.documentElement.classList.add(this._classify(theme));
  }

  /**
   *
   *
   * @private
   * @memberof ThemeService
   */
  private resetTheme() {
    this.theme = null;
    this._storageSvc.remove(toTokenize(APP_THEME_TOKEN));
    this._themes.map((t: TTheme) =>
      this._document.documentElement.classList.remove(this._classify(t))
    );
  }

  /**
   *
   *
   * @param {boolean} value
   * @return {TTheme}
   * @memberof ThemeService
   */
  public convertBoolToTheme(value: boolean): TTheme {
    if (value) {
      return 'dark';
    }

    return 'light';
  }

  /**
   *
   *
   * @param {TTheme} value
   * @return {boolean}
   * @memberof ThemeService
   */
  public convertThemeToBool(value: TTheme): boolean {
    return value === 'dark';
  }

  /**
   *
   *
   * @param {boolean} value
   * @return {boolean}
   * @memberof ThemeService
   */
  public convertBoolToIcon(value: boolean): string {
    if (value) {
      return 'moon';
    }

    return 'sun';
  }

  /**
   *
   *
   * @param {TTheme} value
   * @return {boolean}
   * @memberof ThemeService
   */
  public convertThemeToIcon(value: TTheme): string {
    if (value === 'dark') {
      return 'moon';
    }

    return 'sun';
  }

  /**
   *
   * @description css変数の値を取得する。
   * @deprecated 何か使えると思ったが、CSS変数`var(--clr-xxx)`の方はテーマ切替後再定義されない。
   * @param {string} [style='global-app-background']
   * @return {string}
   * @memberof ThemeService
   */
  public getThemeVar(style: string = 'global-app-background'): string {
    return window
      .getComputedStyle(this._document.documentElement)
      .getPropertyValue(`--clr-${style}`);
  }
}
