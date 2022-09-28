import { Inject, Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { JwtService } from '@shared/services/jwt.service';
import { filter, take } from 'rxjs/operators';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class UnauthorizedService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class UnauthorizedService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof UnauthorizedService
   */
  public expired$: EventEmitter<boolean> = new EventEmitter();

  /**
   *Creates an instance of UnauthorizedService.
   * @param {JwtService} _jwtSvc
   * @memberof UnauthorizedService
   */
  public constructor(@Inject(JwtService) private _jwtSvc: JwtService) {
    super();
    this.init();
  }

  /**
   *
   *
   * @private
   * @memberof UnauthorizedService
   */
  private init(): void {
    this._subscription.add(
      this.expired$
        .pipe(
          filter((expired: boolean) => expired),
          take(1)
        )
        .subscribe(() => this.purge())
    );
  }

  /**
   *
   *
   * @memberof UnauthorizedService
   */
  public ngOnDestroy() {
    this.expired$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @returns {void}
   * @memberof UnauthorizedService
   */
  public purge(): void {
    this._jwtSvc.delete();
    window.setTimeout(() => (window.location.href = '/'), 300);
  }
}
