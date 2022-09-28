import { Inject, Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '@shared/services/api.service';
import { ITicket } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class TicketService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class TicketService
  extends BaseRestService<ITicket>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof TicketService
   */
  public endpoint: string = 'tickets';

  /**
   *Creates an instance of TicketService.
   * @param {ApiService} _apiSvc
   * @memberof TicketService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }
}
