import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { InquiryService } from '@shared/services/inquiry.service';
import { IInquiry } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class InquiryResolver
 * @extends {BaseEntityResolver<IInquiry, InquiryService>}
 * @implements {Resolve<IInquiry>}
 */
@Injectable({
  providedIn: 'root',
})
export class InquiryResolver
  extends BaseEntityResolver<IInquiry, InquiryService>
  implements Resolve<IInquiry> {
  /**
   *Creates an instance of InquiryResolver.
   * @param {InquiryService} _inquirySvc
   * @param {Router} _router
   * @memberof InquiryResolver
   */
  public constructor(
    protected _inquirySvc: InquiryService,
    protected _router: Router
  ) {
    super(_inquirySvc, _router);
  }
}
