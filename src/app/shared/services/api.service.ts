import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  throwError as throwError$,
  from as fromPromise$,
  EMPTY as EMPTY$,
} from 'rxjs';
import { concatMap, catchError, map, timeout, take } from 'rxjs/operators';
import { _, Util } from '@core/class/util';
import { LoggerService } from '@shared/services/logger.service';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class ApiService
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService extends BaseService implements OnDestroy {
  /**
   *Creates an instance of ApiService.
   * @param {LoggerService} _loggerSvc
   * @param {Router} _router
   * @param {HttpClient} _http
   * @memberof ApiService
   */
  public constructor(
    @Inject(LoggerService) private _loggerSvc: LoggerService,
    private _router: Router,
    private _http: HttpClient
  ) {
    super();
  }

  /**
   *
   *
   * @memberof ApiService
   */
  public ngOnDestroy() {}

  /**
   *
   *
   * @private
   * @param {string} url
   * @returns {string}
   * @memberof ApiService
   */
  private extractUrl(url: string): string {
    const isAbsolute: boolean =
      _.toLower(url).startsWith('//') ||
      _.toLower(url).startsWith('http://') ||
      _.toLower(url).startsWith('https://');
    if (isAbsolute) {
      return url;
    }

    return `${environment.api.url}${url}`;
  }

  /**
   *
   *
   * @private
   * @param {({ [name: string]: string | string[] })} [headersConfig={ 'Content-Type': 'application/json' }]
   * @returns {HttpHeaders}
   * @memberof ApiService
   */
  private setHeaders(
    headersConfig: { [name: string]: string | string[] } = {
      'Content-Type': 'application/json',
    }
  ): HttpHeaders {
    return new HttpHeaders(headersConfig);
  }

  /**
   *
   *
   * @private
   * @memberof ApiService
   */
  private formatErrors = (
    error: HttpErrorResponse | Error
  ): Observable<never> => {
    this._loggerSvc.error(error);
    if (error instanceof HttpErrorResponse) {
      let redirectTo: string = null;
      switch (error.status) {
        case 401:
          redirectTo = '/logout';
          break;

        case 403:
          redirectTo = '/error';
          break;

        default:
          break;
      }

      if (redirectTo) {
        return fromPromise$(this._router.navigate([redirectTo])).pipe(
          catchError(() => EMPTY$),
          concatMap(() => EMPTY$),
          take(1)
        );
      }
    }

    return throwError$(error);
  };

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {number} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public get<T>(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout: number = environment.threshold.requestTimeout
  ): Observable<T> {
    return this._http
      .get<T>(this.extractUrl(endpoint), {
        headers: this.setHeaders({ Accept: 'application/json' }),
        observe: 'body',
        params,
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {number} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<Blob>}
   * @memberof ApiService
   */
  public download<T>(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout: number = environment.threshold.requestTimeout
  ): Observable<Blob> {
    return this._http
      .get(this.extractUrl(endpoint), {
        headers: this.setHeaders({
          'Content-Type': 'application/octet-stream',
        }),
        observe: 'response',
        responseType: 'blob',
        withCredentials: false,
        reportProgress: false,
        params,
      })
      .pipe(
        timeout(requestTimeout),
        map(
          (response: HttpResponse<Blob>) =>
            new Blob([response.body], { type: 'application/octet-stream' })
        ),
        // map((response: HttpResponse<Observable<Blob>>) => new Blob([response], { type: 'application/octet-stream' }))
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<Blob>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {*} [body={}]
   * @param {HttpParams} [params=new HttpParams()]
   * @param {number} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public put<T>(
    endpoint: string,
    body: any = {},
    params: HttpParams = new HttpParams(),
    requestTimeout: number = environment.threshold.requestTimeout
  ): Observable<T> {
    return this._http
      .put<T>(this.extractUrl(endpoint), this.toBody(body), {
        headers: this.setHeaders(),
        observe: 'body',
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
        params,
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {*} [body={}]
   * @param {HttpParams} [params=new HttpParams()]
   * @param {number} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public post<T>(
    endpoint: string,
    body: any = {},
    params: HttpParams = new HttpParams(),
    requestTimeout: number = environment.threshold.requestTimeout
  ): Observable<T> {
    return this._http
      .post<T>(this.extractUrl(endpoint), this.toBody(body), {
        headers: this.setHeaders(),
        observe: 'body',
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
        params,
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {number} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<T>}
   * @memberof ApiService
   */
  public delete<T>(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout: number = environment.threshold.requestTimeout
  ): Observable<T> {
    return this._http
      .delete<T>(this.extractUrl(endpoint), {
        headers: this.setHeaders(),
        observe: 'body',
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
        params,
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {*} [body={}]
   * @param {HttpParams} [params=new HttpParams()]
   * @param {number} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<any>}
   * @memberof ApiService
   */
  public patch<T>(
    endpoint: string,
    body: any = {},
    params: HttpParams = new HttpParams(),
    requestTimeout: number = environment.threshold.requestTimeout
  ): Observable<any> {
    return this._http
      .patch<T>(this.extractUrl(endpoint), this.toBody(body), {
        headers: this.setHeaders(),
        observe: 'body',
        responseType: 'json',
        withCredentials: false,
        reportProgress: false,
        params,
      })
      .pipe(
        timeout(requestTimeout),
        map((response: T) => response as T),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<T>;
  }

  /**
   *
   *
   * @template T
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {number} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<Blob>}
   * @memberof ApiService
   */
  public pdf<T>(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout: number = environment.threshold.requestTimeout
  ): Observable<Blob> {
    return this._http
      .get(this.extractUrl(endpoint), {
        headers: this.setHeaders({ 'Content-Type': 'application/pdf' }),
        observe: 'response',
        responseType: 'blob',
        withCredentials: false,
        reportProgress: false,
        params,
      })
      .pipe(
        timeout(requestTimeout),
        map(
          (response: HttpResponse<Blob>) =>
            new Blob([response.body], { type: 'application/pdf' })
        ),
        // map((response: HttpResponse<Observable<Blob>>) => new Blob([response], { type: 'application/pdf' }))
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<Blob>;
  }

  /**
   *
   *
   * @param {string} endpoint
   * @param {HttpParams} [params=new HttpParams()]
   * @param {number} [requestTimeout=environment.threshold.requestTimeout]
   * @returns {Observable<string>}
   * @memberof ApiService
   */
  public svg(
    endpoint: string,
    params: HttpParams = new HttpParams(),
    requestTimeout: number = environment.threshold.requestTimeout
  ): Observable<string> {
    return this._http
      .get(this.extractUrl(endpoint), {
        headers: this.setHeaders({ Accept: 'image/svg+xml' }),
        responseType: 'text',
        observe: 'body',
        params,
        withCredentials: false,
        reportProgress: false,
      })
      .pipe(
        timeout(requestTimeout),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      ) as Observable<string>;
  }

  /**
   *
   *
   * @param {any} payload
   * @return {string}
   * @memberof ApiService
   */
  public toBody(payload: any): string {
    if (_.isString(payload)) {
      const json: any = Util.fromJson(payload);
      if (_.isObjectLike(json)) {
        payload = json;
      }
    }

    return Util.toJson(payload, null, 0);
  }

  /**
   *
   *
   * @template T
   * @param {T} payload
   * @return {T}
   * @memberof ApiService
   */
  public filterParams<T>(payload: T): T {
    return _.pickBy(payload, (v: any) => !_.isUndefined(v)) as T;
  }

  /**
   *
   * @description ObjectをHttpParamsに変換する。GETのクエリと同じなので値がObjectや配列の場合はJSON文字列に変換している。
   * @template T
   * @param {T} payload
   * @return {HttpParams}
   * @memberof ApiService
   */
  public serializeParam<T>(payload: T): HttpParams {
    let params: HttpParams = new HttpParams();
    payload = this.filterParams(payload);
    _.keys(payload).map((k: string) => {
      let v: any = _.get(payload, k);
      v = _.isArray(v) || _.isObjectLike(v) ? this.toBody(v) : v;
      params = params.append(k, v);
    });

    return params;
  }

  /**
   *
   * @description HttpParams形式の値を元のインターフェイスのオブジェクトに戻す。
   * @template T
   * @param {HttpParams} [params=new HttpParams()]
   * @return {T}
   * @memberof ApiService
   */
  public deserializeParam<T>(params: HttpParams = new HttpParams()): T {
    if (params instanceof HttpParams) {
      const payload: any = {};
      params.keys().map((k: string) => {
        let v: any = Util.fromJson(params.get(k));
        v = _.isArray(v) || _.isObjectLike(v) ? v : params.get(k);
        _.set(payload, k, v);
      });

      return this.filterParams(payload) as T;
    }

    return null;
  }
}
