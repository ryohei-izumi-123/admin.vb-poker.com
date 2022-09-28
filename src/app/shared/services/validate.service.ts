import { environment } from '@env/environment';
import { ValidationErrors } from '@angular/forms';
import { Observable, of as of$ } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { IValidate, IValidateUnique, IResult } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class ValidateService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class ValidateService
  extends BaseRestService<IValidate>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof ValidateService
   */
  public endpoint: string = 'Validate';

  /**
   *Creates an instance of ValidateService.
   * @param {ApiService} _apiSvc
   * @memberof ValidateService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }

  /**
   *
   *
   * @param {IValidateUnique} payload
   * @returns {Observable<ValidationErrors>}
   * @memberof ValidateService
   */
  public isUnique$(payload: IValidateUnique): Observable<ValidationErrors> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/unique`;
    const error: ValidationErrors = { async: true };

    return this._apiSvc.post<IResult>(url, payload).pipe(
      map((response: IResult) => (_.get(response, 'result') ? null : error)),
      catchError(() => of$(error)),
      take(1)
    );
  }
}
