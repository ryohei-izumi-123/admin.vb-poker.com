/// <reference types="gapi.auth2" />
import { environment } from '@env/environment';
import { Injectable, Inject, NgZone } from '@angular/core';
import {
  Observable,
  Subscription,
  from as fromPromise$,
  throwError as throwError$,
  of as of$,
} from 'rxjs';
import { map, take, catchError, concatMap, skipUntil } from 'rxjs/operators';
import GoogleAuth = gapi.auth2.GoogleAuth;
import { _ } from '@core/class/util';
import { BaseSocialLoginService } from '@core/class/base-social-login.service';
import { LoadScriptService } from '@shared/services/load-script.service';
import { LoggerService } from '@shared/services/logger.service';
import {
  ISocialUser,
  ISocialLoginOptions,
  ISocialLoginStatusOptions,
} from '@shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class GoogleLoginService extends BaseSocialLoginService {
  /**
   *
   *
   * @type {string}
   * @memberof GoogleLoginService
   */
  public readonly providerId: string = 'GOOGLE';

  /**
   *
   *
   * @type {*}
   * @memberof GoogleLoginService
   */
  public options: any = {
    scope: 'email',
    prompt: 'select_account',
    ux_mode: 'popup',
  };

  /**
   *
   *
   * @private
   * @type {GoogleAuth}
   * @memberof GoogleLoginService
   */
  private _client: GoogleAuth;

  /**
   * Creates an instance of GoogleLoginService.
   * @param {LoadScriptService} _loadScriptSvc
   * @param {LoggerService} _loggerSvc
   * @param {NgZone} _ngZone
   * @memberof GoogleLoginService
   */
  public constructor(
    @Inject(LoadScriptService) protected _loadScriptSvc: LoadScriptService,
    @Inject(LoggerService) protected _loggerSvc: LoggerService,
    @Inject(NgZone) protected _ngZone: NgZone
  ) {
    super(_loadScriptSvc, _loggerSvc, _ngZone);
    this.init();
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof GoogleLoginService
   */
  public init(): Subscription {
    this.options = _.get(environment, 'google.gapi.options');
    const src: string = '//apis.google.com/js/platform.js';

    return this._subscription.add(
      this.loadScript$(src)
        .pipe(
          concatMap(() => this._loadApi$()),
          catchError((error: Error) => throwError$(error)),
          take(1)
        )
        .subscribe((auth: GoogleAuth) => {
          this._client = auth;
          this.isReady = true;
        })
    );
  }

  /**
   *
   *
   * @private
   * @return {Observable<GoogleAuth>}
   * @memberof GoogleLoginService
   */
  private _loadApi$(): Observable<GoogleAuth> {
    return fromPromise$(
      new Promise((resolve, reject) =>
        this._ngZone.runOutsideAngular(() =>
          gapi.load('client:auth2', () => this._ngZone.run(() => resolve(null)))
        )
      )
    ).pipe(
      concatMap(() => this._initAuthInstance$()),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @return {Observable<GoogleAuth>}
   * @memberof GoogleLoginService
   */
  private _initAuthInstance$(): Observable<GoogleAuth> {
    return fromPromise$(gapi.client.init(environment.google.gapi)).pipe(
      map(() => gapi.auth2.getAuthInstance()),
      catchError((error: Error) => {
        this._loggerSvc.warn(error);
        const details: string = _.get(error, 'details', '');
        if (details.includes('deprecated')) {
          return of$(gapi.auth2.getAuthInstance());
        }

        return throwError$(error);
      }),
      take(1)
    );
  }

  /**
   *
   *
   * @return {Observable<boolean>}
   * @memberof GoogleLoginService
   */
  public isLoggedIn$(): Observable<boolean> {
    return this.waitForReady$().pipe(
      map(() => this._client.isSignedIn.get()),
      take(1)
    );
  }

  /**
   *
   *
   * @param {ISocialLoginStatusOptions} [options]
   * @return {Observable<ISocialUser>}
   * @memberof GoogleLoginService
   */
  public getLoginStatus$(
    options?: ISocialLoginStatusOptions
  ): Observable<ISocialUser> {
    return this._getUser$().pipe(take(1));
  }

  /**
   *
   *
   * @param {ISocialLoginOptions} [options]
   * @return {Observable<ISocialUser>}
   * @memberof GoogleLoginService
   */
  public signIn$(options?: ISocialLoginOptions): Observable<ISocialUser> {
    return this.waitForReady$().pipe(
      concatMap(() => fromPromise$(this._client.signIn(this.options))),
      map(() => this._formatUser()),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @return {Observable<ISocialUser>}
   * @memberof GoogleLoginService
   */
  private _getUser$(): Observable<ISocialUser> {
    return this.waitForReady$().pipe(
      skipUntil(this.isLoggedIn$()),
      map(() => this._formatUser()),
      take(1)
    );
  }

  /**
   *
   *
   * @private
   * @return {Observable<ISocialUser>}
   * @memberof GoogleLoginService
   */
  private _formatUser(): ISocialUser {
    const providerId: string = this.providerId;
    const profile: gapi.auth2.BasicProfile = this._client.currentUser
      .get()
      .getBasicProfile();
    const rawData: gapi.auth2.AuthResponse = this._client.currentUser
      .get()
      .getAuthResponse(true);
    const authToken: string = _.get(rawData, 'access_token');
    const idToken: string = _.get(rawData, 'id_token');
    const id: string = profile.getId();
    const name: string = profile.getName();
    const email: string = profile.getEmail();
    const photo: string = profile.getImageUrl();
    const firstName: string = profile.getGivenName();
    const lastName: string = profile.getFamilyName();

    return {
      providerId,
      id,
      name,
      email,
      photo,
      firstName,
      lastName,
      authToken,
      idToken,
      rawData,
    };
  }

  /**
   *
   *
   * @param {boolean} [revoke]
   * @return {Observable<any>}
   * @memberof GoogleLoginService
   */
  public signOut$(revoke?: boolean): Observable<any> {
    if (revoke) {
      return fromPromise$(this._client.disconnect()).pipe(take(1));
    }

    return fromPromise$(this._client.signOut()).pipe(take(1));
  }
}
