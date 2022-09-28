/// <reference types="facebook-js-sdk" />
import { environment } from '@env/environment';
import { Injectable, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  Observable,
  Subscription,
  from as fromPromise$,
  throwError as throwError$,
} from 'rxjs';
import { map, take, catchError, concatMap } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { BaseSocialLoginService } from '@core/class/base-social-login.service';
import { LoadScriptService } from '@shared/services/load-script.service';
import { LoggerService } from '@shared/services/logger.service';
import { LocaleService } from '@shared/services/locale.service';
import {
  ISocialUser,
  ISocialLoginOptions,
  ISocialLoginStatusOptions,
} from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FacebookLoginService extends BaseSocialLoginService {
  /**
   *
   *
   * @type {string}
   * @memberof FacebookLoginService
   */
  public readonly providerId: string = 'FACEBOOK';

  /**
   *
   *
   * @type {*}
   * @memberof FacebookLoginService
   */
  public options: any = {
    cookie: true,
    xfbml: true,
    autoLogAppEvents: true,
    version: 'v10.0',
    locale: 'en_US',
    scope: 'email,public_profile',
    fields: 'name,email,picture,first_name,last_name',
  };

  /**
   * Creates an instance of FacebookLoginService.
   * @param {LoadScriptService} _loadScriptSvc
   * @param {LoggerService} _loggerSvc
   * @param {NgZone} _ngZone
   * @param {Document} _document
   * @param {LocaleService} _localeSvc
   * @memberof FacebookLoginService
   */
  public constructor(
    @Inject(LoadScriptService) protected _loadScriptSvc: LoadScriptService,
    @Inject(LoggerService) protected _loggerSvc: LoggerService,
    @Inject(NgZone) protected _ngZone: NgZone,
    @Inject(DOCUMENT) private _document: Document,
    @Inject(LocaleService) protected _localeSvc: LocaleService
  ) {
    super(_loadScriptSvc, _loggerSvc, _ngZone);
    this.init();
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof FacebookLoginService
   */
  public init(): Subscription {
    this.options = _.get(environment, 'facebook');
    const locale: string = this._localeSvc.locale;
    const version: string = _.get(this.options, 'version', 'v10.0');
    const xfbml: string = _.get(this.options, 'xfbml', true) ? '1' : '0';
    const src: string = `//connect.facebook.net/${locale}/sdk.js#xfbml=${xfbml}&version=${version}`;
    _.set(this.options, 'locale', locale);

    window.fbAsyncInit = () => this._fbAsyncInit();
    this._setFbRootElement();

    return this._subscription.add(
      this.loadScript$(src)
        .pipe(
          catchError((error: Error) => throwError$(error)),
          take(1)
        )
        .subscribe()
    );
  }

  /**
   *
   *
   * @return {Observable<boolean>}
   * @memberof FacebookLoginService
   */
  public isLoggedIn$(): Observable<boolean> {
    return this.waitForReady$().pipe(
      concatMap(() => this._getLoginStatus$()),
      map((response: fb.StatusResponse) => {
        const status: fb.LoginStatus = _.get(response, 'status');
        return _.get(response, 'status') === 'connected';
      }),
      take(1)
    );
  }

  /**
   *
   *
   * @param {ISocialLoginStatusOptions} [options]
   * @return {Observable<ISocialUser>}
   * @memberof FacebookLoginService
   */
  public getLoginStatus$(
    options?: ISocialLoginStatusOptions
  ): Observable<ISocialUser> {
    return this.waitForReady$().pipe(
      concatMap(() => this._getLoginStatus$()),
      concatMap((response: fb.StatusResponse) => this._getUser$(response)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {ISocialLoginOptions} [options]
   * @return {Observable<ISocialUser>}
   * @memberof FacebookLoginService
   */
  public signIn$(options?: ISocialLoginOptions): Observable<ISocialUser> {
    const scope: string = _.get(this.options, 'scope', 'email,public_profile');
    const payload: fb.LoginOptions = { scope };

    return this.waitForReady$().pipe(
      concatMap(() => this._login$(payload)),
      concatMap((response: fb.StatusResponse) => this._getUser$(response)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {boolean} [revoke]
   * @return {Observable<any>}
   * @memberof FacebookLoginService
   */
  public signOut$(revoke?: boolean): Observable<any> {
    return this.waitForReady$().pipe(
      concatMap(() => this._logout$()),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @return {void}
   * @memberof FacebookLoginService
   */
  private _fbAsyncInit(): void {
    this._ngZone.runOutsideAngular(() =>
      this._ngZone.run(() => {
        const appId: string = _.get(this.options, 'appId');
        const cookie: string = _.get(this.options, 'cookie', true);
        const xfbml: string = _.get(this.options, 'xfbml', true);
        const autoLogAppEvents: string = _.get(
          this.options,
          'autoLogAppEvents',
          true
        );
        const version: string = _.get(this.options, 'version', 'v10.0');
        const payload: any = {
          appId,
          cookie,
          xfbml,
          autoLogAppEvents,
          version,
        };

        FB.init(payload);
        this.isReady = true;
      })
    );
  }

  /**
   *
   *
   * @private
   * @param {fb.LoginOptions} [payload]
   * @return {Observable<fb.StatusResponse>}
   * @memberof FacebookLoginService
   */
  private _login$(payload?: fb.LoginOptions): Observable<fb.StatusResponse> {
    const promise: Promise<fb.StatusResponse> = new Promise((resolve, reject) =>
      FB.login((response: fb.StatusResponse) => resolve(response), payload)
    );

    return fromPromise$(promise).pipe(
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   * @private
   * @return {Observable<fb.StatusResponse>}
   * @memberof FacebookLoginService
   */
  private _logout$(): Observable<fb.StatusResponse> {
    const promise: Promise<fb.StatusResponse> = new Promise((resolve, reject) =>
      FB.logout((response: fb.StatusResponse) => resolve(response))
    );

    return fromPromise$(promise).pipe(
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @param {fb.LoginOptions} [payload]
   * @return {Observable<fb.StatusResponse>}
   * @memberof FacebookLoginService
   */
  private _getLoginStatus$(
    payload?: fb.LoginOptions
  ): Observable<fb.StatusResponse> {
    const promise: Promise<fb.StatusResponse> = new Promise((resolve, reject) =>
      FB.getLoginStatus((response: fb.StatusResponse) => resolve(response))
    );

    return fromPromise$(promise).pipe(
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @param {fb.StatusResponse} response
   * @return {Observable<ISocialUser>}
   * @memberof FacebookLoginService
   */
  private _getUser$(response: fb.StatusResponse): Observable<ISocialUser> {
    const promise: Promise<ISocialUser> = new Promise((resolve, reject) => {
      const status: fb.LoginStatus = _.get(response, 'status');
      const authResponse: fb.AuthResponse = _.get(response, 'authResponse');
      if (status !== 'connected' || !authResponse) {
        return reject(
          new Error('User cancelled login or did not fully authorize.')
        );
      }

      const fields: string = _.get(this.options, 'fields');
      FB.api(`/me?fields=${fields}`, (rawData: any) => {
        const providerId: string = this.providerId;
        const id: string = _.get(rawData, 'id');
        const name: string = _.get(rawData, 'name');
        const email: string = _.get(rawData, 'email');
        const photo: string = `//graph.facebook.com/${id}/picture?type=normal`;
        const firstName: string = _.get(rawData, 'first_name');
        const lastName: string = _.get(rawData, 'last_name');
        const authToken: string = _.get(authResponse, 'accessToken');
        const user: ISocialUser = {
          providerId,
          id,
          name,
          email,
          photo,
          firstName,
          lastName,
          authToken,
          rawData,
        };

        return resolve(user);
      });
    });

    return fromPromise$(promise).pipe(
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @memberof FacebookLoginService
   */
  private _setFbRootElement(): void {
    const id: string = 'fb-root';
    if (!this._document.getElementById(id)) {
      const $div = this._document.createElement('div');
      $div.id = id;
      this._document.body.appendChild($div);
    }
  }
}
