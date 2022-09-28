import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy, NgZone } from '@angular/core';
import {
  Observable,
  Subscription,
  BehaviorSubject,
  EMPTY as EMPTY$,
  from as fromPromise$,
  throwError as throwError$,
  of as of$,
} from 'rxjs';
import { take, distinctUntilChanged, skipWhile } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { LoadScriptService } from '@shared/services/load-script.service';
import { LoggerService } from '@shared/services/logger.service';
import {
  ISocialUser,
  ISocialLoginOptions,
  ISocialLoginStatusOptions,
} from '@shared/interfaces';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @abstract
 * @class BaseSocialLoginService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: null,
})
export abstract class BaseSocialLoginService
  extends BaseService
  implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof BaseSocialLoginService
   */
  private _isReadySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   *
   *
   * @param {boolean} isReady
   * @memberof BaseSocialLoginService
   */
  public set isReady(isReady: boolean) {
    this._isReadySubject.next(isReady);
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof BaseSocialLoginService
   */
  public get isReady(): boolean {
    return this._isReadySubject.getValue() as boolean;
  }

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof BaseSocialLoginService
   */
  public isReady$: Observable<boolean> = this._isReadySubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @protected
   * @abstract
   * @type {string}
   * @memberof BaseSocialLoginService
   */
  protected abstract readonly providerId: string;

  /**
   *
   *
   * @protected
   * @abstract
   * @type {*}
   * @memberof BaseSocialLoginService
   */
  protected abstract options: any;

  /**
   * Creates an instance of BaseSocialLoginService.
   * @param {LoadScriptService} _loadScriptSvc
   * @param {LoggerService} _loggerSvc
   * @param {NgZone} _ngZone
   * @memberof BaseSocialLoginService
   */
  public constructor(
    @Inject(LoadScriptService) protected _loadScriptSvc: LoadScriptService,
    @Inject(LoggerService) protected _loggerSvc: LoggerService,
    @Inject(NgZone) protected _ngZone: NgZone
  ) {
    super();
  }

  /**
   *
   *
   * @protected
   * @abstract
   * @return {Subscription}
   * @memberof BaseSocialLoginService
   */
  protected abstract init(): Subscription;

  /**
   *
   *
   * @protected
   * @abstract
   * @return {Observable<boolean>}
   * @memberof BaseSocialLoginService
   */
  protected abstract isLoggedIn$(): Observable<boolean>;

  /**
   *
   *
   * @protected
   * @abstract
   * @param {ISocialLoginStatusOptions} [options]
   * @return {Observable<ISocialUser>}
   * @memberof BaseSocialLoginService
   */
  protected abstract getLoginStatus$(
    options?: ISocialLoginStatusOptions
  ): Observable<ISocialUser>;

  /**
   *
   *
   * @protected
   * @abstract
   * @param {ISocialLoginOptions} [options]
   * @return {Observable<ISocialUser>}
   * @memberof BaseSocialLoginService
   */
  protected abstract signIn$(
    options?: ISocialLoginOptions
  ): Observable<ISocialUser>;

  /**
   *
   *
   * @protected
   * @abstract
   * @param {boolean} [revoke]
   * @return {Observable<any>}
   * @memberof BaseSocialLoginService
   */
  protected abstract signOut$(revoke?: boolean): Observable<any>;

  /**
   *
   *
   * @memberof BaseSocialLoginService
   */
  public ngOnDestroy() {
    super.ngOnDestroy();
    this._isReadySubject.complete();
  }

  /**
   *
   *
   * @param {string} src
   * @returns {Observable<string>}
   * @memberof BaseSocialLoginService
   */
  public loadScript$(src: string): Observable<string> {
    return this._loadScriptSvc.load$(src).pipe(take(1));
  }

  /**
   *
   *
   * @return {Observable<boolean>}
   * @memberof BaseSocialLoginService
   */
  public waitForReady$(): Observable<boolean> {
    return this.isReady$.pipe(
      skipWhile((isReady: boolean) => !!!isReady),
      take(1)
    );
  }
}
