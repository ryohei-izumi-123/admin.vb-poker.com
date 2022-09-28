import { environment } from '@env/environment';
import { Inject, Injector, Injectable, LOCALE_ID } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import {
  Observable,
  throwError as throwError$,
  interval as interval$,
} from 'rxjs';
import { catchError, map, concatMap, delayWhen } from 'rxjs/operators';
import { JwtService } from '@shared/services/jwt.service';
import { FingerPrintService } from '@shared/services/finger-print.service';
import { TIso6391, TScope } from '@shared/types';

/**
 *
 *
 * @export
 * @class ApiInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of ApiInterceptor.
   * @param {TIso6391} _localeId
   * @param {Injector} _injector
   * @memberof ApiInterceptor
   */
  public constructor(
    @Inject(LOCALE_ID) private _localeId: TIso6391,
    private _injector: Injector
  ) {}

  /**
   *
   *
   * @private
   * @param {HttpResponse<any>} response
   * @return {HttpResponse<any>}
   * @memberof ApiInterceptor
   */
  private noopResponseMapper(response: HttpResponse<any>): HttpResponse<any> {
    return response;
  }

  /**
   *
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof ApiInterceptor
   */
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const _jwtSvc: JwtService = this._injector.get(JwtService);
    const _fingerPrintSvc: FingerPrintService = this._injector.get(
      FingerPrintService
    );
    const accessToken: string = _jwtSvc.get() || '';
    const delay: number = environment.production ? 0 : 1000;
    const scope: TScope = 'private';

    return _fingerPrintSvc.value$.pipe(
      delayWhen(() => interval$(delay)),
      map((fingerPrint: string) =>
        request.clone({
          withCredentials: true,
          setHeaders: {
            'User-Language': this._localeId,
            Authorization: `bearer ${accessToken}`,
            'X-AUTH-TOKEN': fingerPrint,
            'X-API-SCOPE': scope,
          },
        })
      ),
      concatMap((clone: HttpRequest<any>) => next.handle(clone)),
      map(($event: HttpEvent<any>) =>
        $event instanceof HttpResponse
          ? this.noopResponseMapper($event)
          : $event
      ),

      catchError((error: HttpErrorResponse) => throwError$(error))
    );
  }
}
