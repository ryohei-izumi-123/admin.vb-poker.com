import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { IInquiry } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class InquiryService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class InquiryService
  extends BaseRestService<IInquiry>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof InquiryService
   */
  public endpoint: string = 'inquiries';

  /**
   *Creates an instance of InquiryService.
   * @param {ApiService} _apiSvc
   * @memberof InquiryService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }
}
