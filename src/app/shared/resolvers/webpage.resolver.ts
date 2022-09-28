import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { WebpageService } from '@shared/services/webpage.service';
import { IWebpage } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class WebpageResolver
 * @extends {BaseEntityResolver<IWebpage, WebpageService>}
 * @implements {Resolve<IWebpage>}
 */
@Injectable({
  providedIn: 'root',
})
export class WebpageResolver
  extends BaseEntityResolver<IWebpage, WebpageService>
  implements Resolve<IWebpage> {
  /**
   *Creates an instance of WebpageResolver.
   * @param {WebpageService} _webpageSvc
   * @param {Router} _router
   * @memberof WebpageResolver
   */
  public constructor(
    protected _webpageSvc: WebpageService,
    protected _router: Router
  ) {
    super(_webpageSvc, _router);
  }
}
