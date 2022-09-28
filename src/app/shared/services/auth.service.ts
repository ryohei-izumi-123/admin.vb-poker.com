import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  interval as interval$,
  merge as merge$,
  Observable,
  BehaviorSubject,
  ReplaySubject,
  throwError as throwError$,
  EMPTY as EMPTY$,
  of as of$,
  iif as if$,
  from as fromPromise$,
} from 'rxjs';
import {
  take,
  tap,
  skipWhile,
  distinctUntilChanged,
  catchError,
  finalize,
  concatMap,
  mergeMap,
  delay,
  map,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { APP_LOGIN_CREDENTIALS, toTokenize } from '@shared/tokens';
import { ApiService } from '@shared/services/api.service';
import { UnauthorizedService } from '@shared/services/unauthorized.service';
import { JwtService } from '@shared/services/jwt.service';
import { StorageService } from '@shared/services/storage.service';
import { SocketService } from '@shared/services/socket.service';
import {
  IAuth,
  IAuthParam,
  IAuthTotpParam,
  IAuthQr,
  IUser,
  IResult,
} from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class AuthService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseRestService<IAuth> implements OnDestroy {
  /**
   *
   * @private
   * @type {EventEmitter<boolean>}
   * @memberof AuthService
   */
  private _trigger$: EventEmitter<boolean> = new EventEmitter();

  /**
   *
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof AuthService
   */
  public get trigger$(): Observable<boolean> {
    return this._trigger$.asObservable().pipe(distinctUntilChanged());
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof AuthService
   */
  public get interval(): number {
    return this._interval;
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof AuthService
   */
  private _interval: number = 60000;

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IUser>}
   * @memberof AuthService
   */
  private _userSubject: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(
    null
  );

  /**
   *
   *
   * @type {Observable<IUser>}
   * @memberof AuthService
   */
  public user$: Observable<IUser> = this._userSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof AuthService
   */
  public hasSecurity$: Observable<boolean> = this.user$.pipe(
    map((user: IUser) => _.get(user, 'config.security.method') === 'google'),
    distinctUntilChanged()
  );

  /**
   *
   *
   * @private
   * @type {ReplaySubject<boolean>}
   * @memberof AuthService
   */
  private _isAuthenticatedSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(
    1
  );

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof AuthService
   */
  public isAuthenticated$: Observable<boolean> = this._isAuthenticatedSubject
    .asObservable()
    .pipe();

  /**
   *
   *
   * @type {string}
   * @memberof AuthService
   */
  public endpoint: string = 'auth';

  /**
   * Creates an instance of AuthService.
   * @param {StorageService} _storageSvc
   * @param {UnauthorizedService} _unauthorizedSvc
   * @param {ApiService} _apiSvc
   * @param {JwtService} _jwtSvc
   * @param {SocketService} _socketSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @memberof AuthService
   */
  public constructor(
    @Inject(StorageService) private _storageSvc: StorageService,
    @Inject(UnauthorizedService) private _unauthorizedSvc: UnauthorizedService,
    @Inject(ApiService) protected _apiSvc: ApiService,
    @Inject(JwtService) private _jwtSvc: JwtService,
    @Inject(SocketService) private _socketSvc: SocketService,
    @Inject(TranslateService) private _translateSvc: TranslateService,
    @Inject(Router) private _router: Router
  ) {
    super(_apiSvc);
    this.init();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof AuthService
   */
  private get hasToken(): boolean {
    return _.isEmpty(this._jwtSvc.get()) === false;
  }

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof AuthService
   */
  private _storeKey: string = toTokenize(APP_LOGIN_CREDENTIALS);

  /**
   *
   *
   * @returns {IAuthParam}
   * @memberof AuthService
   */
  public restoreCredentials(): IAuthParam {
    return (
      this._storageSvc.get(this._storeKey) || {
        username: undefined,
        password: undefined,
        remember: false,
      }
    );
  }

  /**
   *
   *
   * @param {IAuthParam} param
   * @memberof AuthService
   */
  public storeCredentials(param: IAuthParam): void {
    this._storageSvc.set(this._storeKey, param);
  }

  /**
   *
   *
   * @memberof AuthService
   */
  public flushCredentials(): void {
    this._storageSvc.remove(this._storeKey);
  }

  /**
   *
   *
   * @memberof AuthService
   */
  public setCredentials(payload: IAuthParam): void {
    const remember: boolean = _.get(payload, 'remember');
    this.flushCredentials();
    if (remember) {
      this.storeCredentials(payload);
    }
  }

  /**
   *
   *
   * @protected
   * @memberof AuthService
   */
  protected init(): void {
    this.user = null;
    this._subscription.add(this.user$.subscribe());
    this._subscription.add(this.isAuthenticated$.subscribe());
    const source$: Observable<boolean | number> = merge$(
      interval$(0).pipe(
        take(1),
        tap(() => this._socketSvc.connect())
      ),
      interval$(this.interval),
      this.trigger$
    );

    this._subscription.add(
      source$
        .pipe(skipWhile(() => !this.hasToken))
        .pipe(concatMap(() => this.getUser$()))
        .subscribe()
    );
  }

  /**
   *
   *
   * @memberof AuthService
   */
  public ngOnDestroy() {
    this._userSubject.complete();
    this._trigger$.complete();
    this._isAuthenticatedSubject.complete();
    this._subscription.unsubscribe();
  }

  /**
   *
   *
   * @param {IUser} user
   * @memberof AuthService
   */
  public set user(user: IUser) {
    this._userSubject.next(user);
    this._isAuthenticatedSubject.next(user ? true : false);
  }

  /**
   *
   *
   * @returns {IUser}
   * @memberof AuthService
   */
  public get user(): IUser {
    return (this._userSubject.getValue() as IUser) as IUser;
  }

  /**
   *
   *
   * @returns {Observable<IUser>}
   * @memberof AuthService
   */
  public getUser$(): Observable<IUser> {
    return this._apiSvc
      .get<IUser>(`${environment.api.endpoint.api}/${this.endpoint}`)
      .pipe(
        catchError((error: Error) => throwError$(error)),
        tap((user: IUser) => (this.user = user)),
        take(1)
      );
  }

  /**
   *
   *
   * @param {IAuthParam} payload
   * @returns {Observable<IAuth>}
   * @memberof AuthService
   */
  public attempt$(payload: IAuthParam): Observable<boolean> {
    return this._apiSvc
      .post<IAuth>(`${environment.api.endpoint.api}/${this.endpoint}`, payload)
      .pipe(
        mergeMap((response: IAuth) =>
          if$(
            () => _.get(response, 'method') === 'google',
            of$(false),
            this.onAuthenticated$(payload, response)
          )
        ),
        take(1)
      );
  }

  /**
   *
   *
   * @param {IAuthTotpParam} payload
   * @returns {Observable<IAuth>}
   * @memberof AuthService
   */
  public totp$(payload: IAuthTotpParam): Observable<boolean> {
    return this._apiSvc
      .post<IAuth>(
        `${environment.api.endpoint.api}/${this.endpoint}/totp`,
        payload
      )
      .pipe(
        concatMap((response: IAuth) =>
          this.onAuthenticated$(payload, response)
        ),
        take(1)
      );
  }

  /**
   *
   *
   * @param {IAuthParam} payload
   * @param {IAuth} response
   * @return {Observable<boolean>}
   * @memberof AuthService
   */
  public onAuthenticated$(
    payload: IAuthParam,
    response: IAuth
  ): Observable<boolean> {
    return of$(response).pipe(
      tap(() => this._jwtSvc.set(_.get(response, 'accessToken'))),
      tap(() => this.setCredentials(payload)),
      // tap(() => this._socketSvc.connect()),
      concatMap(() => this.getUser$()),
      concatMap((user: IUser) => this.redirectToDashboard$(user))
    );
  }

  /**
   *
   *
   * @param {IUser} user
   * @return {Observable<boolean>}
   * @memberof AuthService
   */
  public redirectToDashboard$(user: IUser): Observable<boolean> {
    const duration: number = 100;
    const commands: any[] = ['/home'];
    const navigationExtras: NavigationExtras = {
      queryParams: {
        message: this.translate('errors.loginSuccess', user),
        type: 'success',
      },
      queryParamsHandling: 'merge',
    };

    return fromPromise$(this._router.navigate(commands, navigationExtras)).pipe(
      delay(duration),
      catchError(() => of$(false)),
      take(1)
    );
  }

  /**
   *
   *
   * @returns {Observable<boolean>}
   * @memberof AuthService
   */
  public signOut$(): Observable<boolean> {
    return of$(true).pipe(
      tap(() => this._socketSvc.disconnect()),
      finalize(() => this._unauthorizedSvc.expired$.emit(true)),
      catchError(() => EMPTY$),
      take(1)
    );
  }

  /**
   *
   *
   * @param {number} id
   * @return {Observable<IAuth>}
   * @memberof AuthService
   */
  public getById$(id: number = null): Observable<IAuth> {
    return this.getUser$().pipe(
      map((user: IUser) => user as IAuth),
      take(1)
    );
  }

  /**
   *
   *
   * @param {IAuth} row
   * @return {Observable<IAuth>}
   * @memberof AuthService
   */
  public update$(row: IAuth): Observable<IAuth> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}`;
    return this._apiSvc.patch<IAuth>(url, row).pipe(take(1));
  }

  /**
   *
   *
   * @return {Observable<IAuthQr>}
   * @memberof AuthService
   */
  public getQrCode$(): Observable<IAuthQr> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/qr`;
    return this._apiSvc.patch<IAuthQr>(url).pipe(take(1));
  }

  /**
   *
   *
   * @param {IAuthTotpParam} payload
   * @return {Observable<boolean>}
   * @memberof AuthService
   */
  public security$(payload: IAuthTotpParam): Observable<boolean> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/security`;
    return this._apiSvc.patch<IResult>(url, payload).pipe(
      map((response: IResult) => response.result),
      take(1)
    );
  }

  /**
   *
   *
   * @memberof AuthService
   */
  public triggerFetch(): void {
    this._trigger$.emit(true);
  }

  /**
   *
   *
   * @param {string} key
   * @param {*} [params={}]
   * @returns {string}
   * @memberof AuthService
   */
  public translate(key: string, params: any = {}): string {
    return this._translateSvc.instant(key, params);
  }
}
