import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, EMPTY as EMPTY$ } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  take,
  catchError,
  concatMap,
  map,
} from 'rxjs/operators';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { _ } from '@core/class/util';
import { ApiService } from '@shared/services/api.service';
import { IRecaptcha, IResult } from '@shared/interfaces';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class RecaptchaService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class RecaptchaService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {string}
   * @memberof RecaptchaService
   */
  private _defaultAction: string = 'login';

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof RecaptchaService
   */
  private _siteKey: string = environment.google.recaptcha.siteKey;

  /**
   *
   *
   * @private
   * @type {{ useGlobalDomain: boolean }}
   * @memberof RecaptchaService
   */
  private _options: { useGlobalDomain: boolean } = {
    useGlobalDomain: environment.google.recaptcha.useGlobalDomain,
  };

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof RecaptchaService
   */
  private _isVerifiedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof RecaptchaService
   */
  public isVerified$: Observable<boolean> = this._isVerifiedSubject
    .asObservable()
    .pipe(
      distinctUntilChanged(),
      filter((isVerified: boolean) => !!!_.isNull(isVerified))
    );

  /**
   *
   *
   * @param {boolean} isVerified
   * @memberof RecaptchaService
   */
  public set isVerified(isVerified: boolean) {
    this._isVerifiedSubject.next(isVerified);
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof RecaptchaService
   */
  public get isVerified(): boolean {
    return this._isVerifiedSubject.getValue() as boolean;
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<string>}
   * @memberof RecaptchaService
   */
  private _tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  /**
   *
   *
   * @type {Observable<string>}
   * @memberof RecaptchaService
   */
  public token$: Observable<string> = this._tokenSubject.asObservable().pipe(
    distinctUntilChanged(),
    filter((token: string) => !!!_.isNull(token))
  );

  /**
   *
   *
   * @param {string} token
   * @memberof RecaptchaService
   */
  public set token(token: string) {
    this._tokenSubject.next(token);
  }

  /**
   *
   *
   * @returns {string}
   * @memberof RecaptchaService
   */
  public get token(): string {
    return this._tokenSubject.getValue() as string;
  }

  /**
   * Creates an instance of RecaptchaService.
   * @param {ApiService} _apiSvc
   * @param {ReCaptchaV3Service} _reCaptchaV3Svc
   * @memberof RecaptchaService
   */
  public constructor(
    @Inject(ApiService) private _apiSvc: ApiService,
    @Inject(ReCaptchaV3Service) private _reCaptchaV3Svc: ReCaptchaV3Service
  ) {
    super();
    this.init();
  }

  /**
   *
   *
   * @private
   * @memberof RecaptchaService
   */
  private init(): void {
    this._subscription.add(this.isVerified$.pipe().subscribe());
    this._subscription.add(
      this.token$
        .pipe(concatMap(() => this.verify$()))
        .subscribe((isVerified: boolean) => (this.isVerified = isVerified))
    );
    this.execute();
  }

  /**
   *
   *
   * @memberof RecaptchaService
   */
  public ngOnDestroy() {
    this._isVerifiedSubject.complete();
    this._tokenSubject.complete();
    super.ngOnDestroy();
  }

  /**
   *
   * @private
   * @param {string} [action=this._defaultAction]
   * @returns {void}
   * @memberof RecaptchaService
   */
  private execute(action: string = this._defaultAction): void {
    return this._reCaptchaV3Svc.execute(
      this._siteKey,
      action,
      this.recaptchaCallback.bind(this),
      this._options
    );
  }

  /**
   *
   *
   * @private
   * @param {string} token
   * @memberof RecaptchaService
   */
  private recaptchaCallback(token: string): void {
    this.token = token;
  }

  /**
   *
   *
   * @returns {Observable<boolean>}
   * @memberof RecaptchaService
   */
  public verify$(): Observable<boolean> {
    const token: string = this.token;
    const payload: IRecaptcha = {
      token,
    };
    if (_.isEmpty(token)) {
      return EMPTY$;
    }

    return this._apiSvc
      .post<IResult>(`${environment.api.endpoint.api}/recaptcha`, payload)
      .pipe(
        catchError((error: Error) => EMPTY$),
        map((result: IResult) => _.get(result, 'result') as boolean),
        take(1)
      );
  }
}
