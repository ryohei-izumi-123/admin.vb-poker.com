import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, from as from$ } from 'rxjs';
import { mergeMap, tap, take } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { ClarityIcons } from '@clr/icons';
import { BaseService } from '@core/class/base.service';
import { ApiService } from '@shared/services/api.service';

/**
 * @description ここで`clr-icon`にカスタムアイコンを登録できる。画像はsvg形式で`/assets/img/{shape}}.svg`に配置すればよい。
 * @export
 * @class IconService
 */
@Injectable({
  providedIn: 'root',
})
export class IconService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {string[]}
   * @memberof IconService
   */
  private _shapes: string[] = [
    'logo',
    'recaptcha',
    'ja',
    'en',
    'android',
    'ios',
    'qr',
  ];

  /**
   *
   *
   * @type {Map<string, string>}
   * @memberof IconService
   */
  public icons: Map<string, string> = new Map();

  /**
   * Creates an instance of IconService.
   * @param {ApiService} _apiSvc
   * @memberof IconService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super();
  }

  /**
   *
   *
   * @private
   * @returns {Observable<string>}
   * @memberof IconService
   */
  private _loadSvg$(name: string): Observable<string> {
    const prefix: string = `/${environment.api.endpoint.assets}/img/`;
    const suffix: string = '.svg';
    const url: string = `${prefix}${name}${suffix}`;

    return this._apiSvc.svg(url).pipe(
      tap((svg: string) => this.add(name, svg)),
      take(1)
    );
  }

  /**
   *
   * @description 非同期かつ並列で処理される。
   * @return {Subscription}
   * @memberof IconService
   */
  public init(): Subscription {
    return this._subscription.add(
      from$(this._shapes)
        .pipe(
          mergeMap((shape: string) => this._loadSvg$(shape)),
          take(_.size(this._shapes))
        )
        .subscribe()
    );
  }

  /**
   *
   * @param {string} name
   * @param {string} svg
   * @memberof IconService
   */
  public add(name: string, svg: string): void {
    if (!this.icons.has(name) && !ClarityIcons.has(name)) {
      this.icons.set(name, svg);
      ClarityIcons.add({ [name]: svg });
    }
  }
}
