import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { Ajv, ErrorObject as AjvErrorObject } from 'ajv';
import { ApiService } from '@shared/services/api.service';
import { ILanguage, ILanguageSchemaValidateResult } from '@shared/interfaces';
import { AJV_INSTANCE } from '@shared/tokens';
import { TScope } from '@shared/types';
import { BaseRestService } from '@core/class/base-rest.service';
import { _ } from '@core/class/util';

/**
 *
 *
 * @export
 * @class LanguageService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageService
  extends BaseRestService<ILanguage>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof LanguageService
   */
  public endpoint: string = 'languages';

  /**
   * Creates an instance of LanguageService.
   * @param {Ajv} _ajv
   * @param {ApiService} _apiSvc
   * @memberof LanguageService
   */
  public constructor(
    @Inject(AJV_INSTANCE) private readonly _ajv: Ajv,
    @Inject(ApiService) protected _apiSvc: ApiService
  ) {
    super(_apiSvc);
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof LanguageService
   */
  public init(): Subscription {
    return this._subscription.add(this.loadSchema$().pipe().subscribe());
  }

  /**
   *
   *
   * @private
   * @param {TScope} [scope='private']
   * @return {Observable<object>}
   * @memberof LanguageService
   */
  private loadSchema$(scope: TScope = 'private'): Observable<object> {
    const url: string = `/${environment.api.endpoint.api}/assets/schema/i18n/${scope}.json`;
    return this._apiSvc.get<object>(url).pipe(
      tap((schema: object) => this._ajv.addSchema(schema, scope)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {*} data
   * @param {TScope} [scope='private']
   * @return {ILanguageSchemaValidateResult}
   * @memberof LanguageService
   */
  public validateSchema(
    data: any,
    scope: TScope = 'private'
  ): ILanguageSchemaValidateResult {
    const isValid = this._ajv.validate(scope, data) as boolean;
    const errorsText: string = this._ajv.errorsText();
    const errors: AjvErrorObject[] = this._ajv.errors || [];
    const errorsAt: string = this._parseErrorsObject(errors);

    return {
      isValid,
      errors,
      errorsText,
      errorsAt,
    };
  }

  /**
   *
   *
   * @private
   * @param {AjvErrorObject[]} errors
   * @return {string}
   * @memberof LanguageService
   */
  private _parseErrorsObject(errors: AjvErrorObject[]): string {
    const filter = (e: AjvErrorObject) => _.get(e, 'keyword') === 'required';
    const mapper = (e: AjvErrorObject) => {
      const delimiter: string = '.';
      let dataPath: string = _.get(e, 'dataPath', '');
      if (dataPath.startsWith(delimiter)) {
        dataPath = `${dataPath.replace(delimiter, '')}${delimiter}`;
      }

      const missingProperty: string = _.get(e, 'params.missingProperty', '');
      return `${dataPath}${missingProperty}`;
    };

    return errors.filter(filter).map(mapper).join(', ');
  }
}
