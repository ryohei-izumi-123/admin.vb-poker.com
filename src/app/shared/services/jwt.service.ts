import { Inject, Injectable, OnDestroy } from '@angular/core';
import { StorageService } from '@shared/services/storage.service';
import { APP_AUTH_TOKEN, toTokenize } from '@shared/tokens';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class JwtService
 */
@Injectable({
  providedIn: 'root',
})
export class JwtService extends BaseService implements OnDestroy {
  /**
   *Creates an instance of JwtService.
   * @param {StorageService} _storageSvc
   * @memberof JwtService
   */
  public constructor(
    @Inject(StorageService) private _storageSvc: StorageService
  ) {
    super();
  }

  /**
   *
   *
   * @returns {string}
   * @memberof JwtService
   */
  public get(): string {
    return this._storageSvc.get(toTokenize(APP_AUTH_TOKEN));
  }

  /**
   *
   *
   * @param {string} value
   * @memberof JwtService
   */
  public set(value: string): void {
    this._storageSvc.set(toTokenize(APP_AUTH_TOKEN), value);
  }

  /**
   *
   *
   * @memberof JwtService
   */
  public delete(): void {
    this._storageSvc.remove(toTokenize(APP_AUTH_TOKEN));
  }
}
