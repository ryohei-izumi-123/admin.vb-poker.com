import { environment } from '@env/environment';
import { Injectable, Injector, ErrorHandler, NgZone } from '@angular/core';
import { PathLocationStrategy } from '@angular/common';
import {
  Observable,
  Subscription,
  NEVER as NEVER$,
  from as fromPromise$,
  // throwError as throwError$,
} from 'rxjs';
import {
  catchError,
  take,
  tap,
  map,
  concatMap,
  finalize,
} from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as StackTrace from 'stacktrace-js';
import { _ } from '@core/class/util';
import { moment } from '@core/class/util';
// import * as Sentry from '@sentry/browser';
import * as Sentry from '@sentry/angular';
import { Integrations } from '@sentry/tracing';
import { ApiService } from '@shared/services/api.service';
import { AuthService } from '@shared/services/auth.service';
import { LoggerService } from '@shared/services/logger.service';
import { LocaleService } from '@shared/services/locale.service';
import { IError, IErrorLike } from '@shared/interfaces/error';

/**
 *
 *
 * @export
 * @class AppErrorHandler
 * @implements {ErrorHandler}
 */
@Injectable({
  providedIn: 'root',
})
export class AppErrorHandler implements ErrorHandler {
  /**
   *
   *
   * @readonly
   * @private
   * @type {ApiService}
   * @memberof AppErrorHandler
   */
  private get _apiSvc(): ApiService {
    return this._injector.get(ApiService);
  }

  /**
   *
   *
   * @readonly
   * @private
   * @type {LoggerService}
   * @memberof AppErrorHandler
   */
  private get _loggerSvc(): LoggerService {
    return this._injector.get(LoggerService);
  }

  /**
   *
   *
   * @readonly
   * @private
   * @type {LocaleService}
   * @memberof AppErrorHandler
   */
  private get _localeSvc(): LocaleService {
    return this._injector.get(LocaleService);
  }

  /**
   *
   *
   * @readonly
   * @private
   * @type {AuthService}
   * @memberof AppErrorHandler
   */
  private get _authSvc(): AuthService {
    return this._injector.get(AuthService);
  }

  /**
   *
   *
   * @readonly
   * @private
   * @type {TranslateService}
   * @memberof AppErrorHandler
   */
  private get _translateSvc(): TranslateService {
    return this._injector.get(TranslateService);
  }

  /**
   * Creates an instance of AppErrorHandler.
   * @param {Injector} _injector
   * @param {NgZone} _ngZone
   * @memberof AppErrorHandler
   */
  public constructor(private _injector: Injector, private _ngZone: NgZone) {
    this._ngZone.runOutsideAngular(() => this._init());
  }

  /**
   *
   *
   * @param {IErrorLike} wrappedError
   * @returns {Subscription}
   * @memberof AppErrorHandler
   */
  public handleError(wrappedError: IErrorLike): Subscription {
    return this._fromError$(wrappedError).pipe(take(1)).subscribe();
  }

  /**
   *
   * @description sentryの初期設定
   * @private
   * @memberof AppErrorHandler
   */
  private _init(): void {
    try {
      if (environment.sentry.enabled) {
        Sentry.init({
          dsn: environment.sentry.dsn,
          debug: environment.sentry.debug,
          integrations: [
            new Integrations.BrowserTracing({
              tracingOrigins: environment.sentry.tracingOrigins,
              routingInstrumentation: Sentry.routingInstrumentation,
            }),
          ],
          tracesSampleRate: environment.sentry.tracesSampleRate,
        });
      }
    } catch (warning) {
      this._loggerSvc.warn(warning);
    }
  }

  /**
   * @see https://github.com/getsentry/sentry/issues/4646
   * @description sentryにレポートする。
   * @private
   * @param {Error} error
   * @memberof AppErrorHandler
   */
  private _reportError(error: Error): void {
    try {
      if (environment.sentry.enabled) {
        Sentry.captureException(error);
        Sentry.createErrorHandler({
          showDialog: environment.sentry.showDialog,
          logErrors: environment.sentry.logErrors,
          dialogOptions: this._dialogOptions,
        }).handleError(error);
      }
    } catch (warning) {
      this._loggerSvc.warn(warning);
    }
  }

  /**
   *
   * @description zonejsの外部でsentryにレポートする。
   * @private
   * @param {Error} error
   * @memberof AppErrorHandler
   */
  private _reportOutsideAngular(error: Error): void {
    return this._ngZone.runOutsideAngular(() => this._reportError(error));
  }

  /**
   *
   * @description ランタイムなエラーでかつ、通常無視して良いエラー（たとえばネットワークエラーや開発時のHMR再コンパイル時などに発生するもの）をここでフィルターする。
   * @private
   * @param {Error} error
   * @return {boolean}
   * @memberof AppErrorHandler
   */
  private _ignoreError(error: Error): boolean {
    if (_.isError(error)) {
      const message: string = _.get(error, 'message') || '';
      const ignores: string[] = [
        'HttpErrorResponse',
        'Non-Error exception captured with keys',
        // 'Timeout has occurred',
        'Injector has already been destroyed.',
      ];

      return ignores.some((i: string) => message.includes(i));
    }

    return true;
  }

  /**
   *
   * @description エラーを処理する。エラーは必ずしもエラーとは限らない（例えば`throw 'abc!'`のようなものも言語仕様として可能）ので適宜処理する。
   * @private
   * @param {IErrorLike} wrappedError
   * @return {Observable<IError>}
   * @memberof AppErrorHandler
   */
  private _fromError$(wrappedError: IErrorLike): Observable<IError> {
    const label: string = '[AppErrorHandler]: ';
    this._log(`${label}handled error`, wrappedError);
    const error: Error = this._findContextError(wrappedError);
    if (this._ignoreError(error)) {
      return NEVER$;
    }

    return fromPromise$(StackTrace.fromError(error)).pipe(
      tap(() => this._reportOutsideAngular(error)),
      map((stackframes: StackTrace.StackFrame[]) => {
        const url: string = this._currentUrl;
        const stackTrace: string = this._getStackTrace(stackframes);
        const message: string = this._getErrorMessage(error);
        const date: string = moment().clone().toISOString();

        return {
          error: {
            stackTrace,
            url,
            message,
            date,
          },
        };
      }),
      concatMap((payload: IError) => this._request$(payload)),
      catchError((uncaughtError: Error) => {
        this._log(`${label}Caught uncaught error`, uncaughtError);
        // return throwError$(uncaughtError);
        return NEVER$;
      }),
      finalize(() => this._log(`${label}Error reported`, error)),
      take(1)
    );
  }

  /**
   *
   * @description バックエンドサーバーへエラーログを送信する。
   * @private
   * @param {IError} payload
   * @return {Observable<IError>}
   * @memberof AppErrorHandler
   */
  private _request$(payload: IError): Observable<IError> {
    const url: string = `${environment.api.endpoint.api}/errors`;
    return this._apiSvc.post<IError>(url, payload).pipe(take(1));
  }

  /**
   *
   * @description 現在のURLを取得する。
   * @readonly
   * @private
   * @type {string}
   * @memberof AppErrorHandler
   */
  private get _currentUrl(): string {
    return location instanceof PathLocationStrategy
      ? location.path()
      : window.location.href;
  }

  /**
   *
   * @description 例外は必ずしもエラーとは限らない(e.g. `throw 123`)ので適切に元のエラーをたどる。またangularの場合、元のエラーをzonejsがラップする仕様なのでそのあたりも考慮。
   * @see https://dev.to/constjs/comment/e56f
   * @see https://github.com/angular/angular/blob/10.0.x/packages/core/src/util/errors.ts
   * @see https://github.com/angular/angular/blob/master/packages/core/src/errors.ts
   * @see https://github.com/angular/angular/blob/master/packages/core/src/error_handler.ts
   * @private
   * @param {IErrorLike} wrappedError
   * @return {Error}
   * @memberof AppErrorHandler
   */
  private _findContextError(wrappedError: IErrorLike): Error {
    let error: Error = this._getOriginalError(wrappedError);
    while (error && this._getOriginalError(error)) {
      error = this._getOriginalError(error);
    }

    if (_.isError(error)) {
      return error;
    }

    error = this._getRejection(wrappedError);
    while (error && this._getRejection(error)) {
      error = this._getRejection(error);
    }

    if (_.isError(error)) {
      return error;
    }

    return wrappedError;
  }

  /**
   *
   * @description angularの旧仕様っぽい。デバッグしたが、この様になるケースは発見できなかったがsentryのドキュメントやangularのcoreの実装はこれに準ずる。
   * @private
   * @param {Error} error
   * @return {Error}
   * @memberof AppErrorHandler
   */
  private _getOriginalError(error: Error): Error {
    return _.get(error, 'originalError') || _.get(error, 'ngOriginalError');
  }

  /**
   *
   * @description Zone.jsがエラーをラップするので大抵ここにもとのエラーが入っている
   * @private
   * @param {Error} error
   * @return {Error}
   * @memberof AppErrorHandler
   */
  private _getRejection(error: Error): Error {
    return _.get(error, 'rejection');
  }

  /**
   *
   * @description エラーメッセージの取得
   * @private
   * @param {Error} error
   * @return {string}
   * @memberof AppErrorHandler
   */
  private _getErrorMessage(error: Error): string {
    if (_.has(error, 'message')) {
      return _.get(error, 'message');
    }

    return _.toString(error);
  }

  /**
   *
   * @description スタックトレースの上位２０を取得する
   * @private
   * @param {StackTrace.StackFrame[]} stackframes
   * @return {string}
   * @memberof AppErrorHandler
   */
  private _getStackTrace(stackframes: StackTrace.StackFrame[]): string {
    return stackframes
      .splice(0, 20)
      .map((sf: StackTrace.StackFrame) => sf.toString())
      .join('\n');
  }

  /**
   *
   *
   * @private
   * @param {...any[]} args
   * @memberof AppErrorHandler
   */
  private _log(...args: any[]): void {
    this._loggerSvc.error(args);
  }

  /**
   *
   * @description ダイアログオプションの設定。ログイン状態が取得できる状況ならログインIDやEMAILアドレスを設定する。
   * @readonly
   * @private
   * @type {Sentry.ReportDialogOptions}
   * @memberof AppErrorHandler
   */
  private get _dialogOptions(): Sentry.ReportDialogOptions {
    return _.pickBy(
      {
        user: {
          email: _.get(this._authSvc.user, 'email', ''),
          name: _.get(this._authSvc.user, 'username', ''),
        },
        lang: this._localeSvc.locale,
        title: this._translate('sentry.title'),
        subtitle: this._translate('sentry.subtitle'),
        subtitle2: this._translate('sentry.subtitle2'),
        labelName: this._translate('sentry.labelName'),
        labelEmail: this._translate('sentry.labelEmail'),
        labelComments: this._translate('sentry.labelComments'),
        labelClose: this._translate('sentry.labelClose'),
        labelSubmit: this._translate('sentry.labelSubmit'),
        errorGeneric: this._translate('sentry.errorGeneric'),
        errorFormEntry: this._translate('sentry.errorFormEntry'),
        successMessage: this._translate('sentry.successMessage'),
      },
      (v: any) => !_.isUndefined(v)
    );
  }

  /**
   *
   *
   * @private
   * @description 低レベル層でのエラーの場合、i18n言語取得ができないことも想定できるのでその場合は`undefined`を返してデフォルト表示に戻す。
   * @param {string} key
   * @return {string}
   * @memberof AppErrorHandler
   */
  private _translate(key: string): string {
    const value: string = this._translateSvc.instant(key);
    if (value === key) {
      return undefined;
    }

    return value;
  }
}
