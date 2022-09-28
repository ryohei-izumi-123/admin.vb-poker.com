import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { LanguageService } from '@shared/services/language.service';
import { ILanguage } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class LanguageResolver
 * @extends {BaseEntityResolver<ILanguage, LanguageService>}
 * @implements {Resolve<ILanguage>}
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageResolver
  extends BaseEntityResolver<ILanguage, LanguageService>
  implements Resolve<ILanguage> {
  /**
   *Creates an instance of LanguageResolver.
   * @param {LanguageService} _languageSvc
   * @param {Router} _router
   * @memberof LanguageResolver
   */
  public constructor(
    protected _languageSvc: LanguageService,
    protected _router: Router
  ) {
    super(_languageSvc, _router);
  }
}
