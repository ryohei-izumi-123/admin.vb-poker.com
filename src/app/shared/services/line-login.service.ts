import { environment } from '@env/environment';
import { Injectable, Inject, NgZone } from '@angular/core';
import { ActivatedRoute, Params as RouteParams } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {
  Observable,
  Subscription,
  from as fromPromise$,
  throwError as throwError$,
  of as of$,
  EMPTY as EMPTY$,
  iif as if$,
} from 'rxjs';
import {
  map,
  take,
  filter,
  catchError,
  concatMap,
  distinctUntilChanged,
  tap,
} from 'rxjs/operators';
import liff from '@line/liff';
import { _ } from '@core/class/util';
import { UrlParser } from '@core/class/url-parser';
import { BaseSocialLoginService } from '@core/class/base-social-login.service';
import { LoadScriptService } from '@shared/services/load-script.service';
import { LoggerService } from '@shared/services/logger.service';
import {
  IUrlSchema,
  ISocialUser,
  ISocialLoginOptions,
  ISocialLoginStatusOptions,
} from '@shared/interfaces';

/**
 *
 * @description see the LINE LIFF docs.
 * @export
 * @class LineLoginService
 * @extends {BaseSocialLoginService}
 */
@Injectable({
  providedIn: 'root',
})
export class LineLoginService extends BaseSocialLoginService {
  /**
   *
   *
   * @type {string}
   * @memberof LineLoginService
   */
  public readonly providerId: string = 'LINE';

  /**
   *
   *
   * @type {*}
   * @memberof LineLoginService
   */
  public options: any = {};

  /**
   * Creates an instance of LineLoginService.
   * @param {LoadScriptService} _loadScriptSvc
   * @param {LoggerService} _loggerSvc
   * @param {NgZone} _ngZone
   * @param {Document} _document
   * @memberof LineLoginService
   */
  public constructor(
    @Inject(LoadScriptService) protected _loadScriptSvc: LoadScriptService,
    @Inject(LoggerService) protected _loggerSvc: LoggerService,
    @Inject(NgZone) protected _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(ActivatedRoute) private _route: ActivatedRoute
  ) {
    super(_loadScriptSvc, _loggerSvc, _ngZone);
    this.init();
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof LineLoginService
   */
  public init(): Subscription {
    this.options = _.get(environment, 'line');
    return this._subscription.add(EMPTY$.subscribe());
  }

  /**
   *
   *
   * @return {Observable<boolean>}
   * @memberof LineLoginService
   */
  public init$(): Observable<boolean> {
    return fromPromise$(
      this.isReady
        ? Promise.resolve(true)
        : liff.init(
            environment.line,
            () => (this.isReady = true),
            (error: Error) => {
              this._loggerSvc.error(error);
              this.isReady = false;
            }
          )
    ).pipe(
      map(() => this.isReady),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @return {Observable<boolean>}
   * @memberof LineLoginService
   */
  public isLoggedIn$(): Observable<boolean> {
    return this._whenIsReady$().pipe(
      map(() => liff.isLoggedIn()),
      take(1)
    );
  }

  /**
   *
   *
   * @param {ISocialLoginStatusOptions} [options]
   * @return {Observable<ISocialUser>}
   * @memberof LineLoginService
   */
  public getLoginStatus$(
    options?: ISocialLoginStatusOptions
  ): Observable<ISocialUser> {
    return this.isLoggedIn$().pipe(
      filter((isLoggedIn: boolean) => isLoggedIn),
      concatMap(() => fromPromise$(liff.getProfile())),
      map((rawData: any) => {
        const providerId: string = this.providerId;
        const id: string = _.get(rawData, 'userId');
        const name: string = _.get(rawData, 'displayName');
        const firstName: string = _.get(rawData, 'displayName');
        const lastName: string = _.get(rawData, 'displayName');
        const email: string = null;
        const photo: string = _.get(rawData, 'pictureUrl');
        const idToken: string = liff.getIDToken();
        const authToken: string = liff.getAccessToken();
        const user: ISocialUser = {
          providerId,
          id,
          idToken,
          authToken,
          name,
          email,
          photo,
          firstName,
          lastName,
          rawData,
        };

        return user;
      }),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {ISocialLoginOptions} [options]
   * @return {Observable<ISocialUser>}
   * @memberof LineLoginService
   */
  public signIn$(options?: ISocialLoginOptions): Observable<ISocialUser> {
    return this._whenIsReady$().pipe(
      tap(() => {
        const isLoggedIn: boolean = liff.isLoggedIn();
        if (!isLoggedIn) {
          const redirectUri: string = window.location.href;
          liff.login({ redirectUri });
        }
      }),
      concatMap(() => this.getLoginStatus$()),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {boolean} [revoke]
   * @return {Observable<boolean>}
   * @memberof LineLoginService
   */
  public signOut$(revoke?: boolean): Observable<boolean> {
    return this.isLoggedIn$().pipe(
      filter((isLoggedIn: boolean) => isLoggedIn),
      tap(() => liff.logout()),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @return {Observable<boolean>}
   * @memberof LineLoginService
   */
  private _whenIsReady$(): Observable<boolean> {
    return if$(() => this.isReady, of$(this.isReady), this.init$()).pipe(
      concatMap(() => this.waitForReady$()),
      take(1)
    );
  }

  /**
   *
   *
   * @return {Observable<boolean>}
   * @memberof LineLoginService
   */
  public isLiffRedirect$(): Observable<boolean> {
    return this._route.queryParams.pipe(
      distinctUntilChanged(),
      map((params: RouteParams) => this._hasLiffStateParams(params)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @param {RouteParams} params
   * @return {boolean}
   * @memberof LineLoginService
   */
  private _hasLiffStateParams(params: RouteParams): boolean {
    const hasParams: boolean = _.has(params, 'liff.state');
    const state: string = _.get(params, 'liff.state', '');
    const stateParams: IUrlSchema = UrlParser.parse(state);
    const queryParams: string = _.get(stateParams, 'query.state', '');

    return hasParams && queryParams === 'init';
  }
}
