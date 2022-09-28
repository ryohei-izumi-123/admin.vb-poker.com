import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 *
 *
 * @export
 * @abstract
 * @class BaseService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: null,
})
export abstract class BaseService implements OnDestroy {
  /**
   *
   *
   * @protected
   * @type {Subscription}
   * @memberof BaseService
   */
  protected _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of BaseService.
   * @memberof BaseService
   */
  public constructor() {}

  /**
   *
   *
   * @memberof BaseService
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
