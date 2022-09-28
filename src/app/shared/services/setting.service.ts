import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  take,
  map,
  filter,
  tap,
  distinctUntilChanged,
  finalize,
  skipWhile,
  skipUntil,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { ApiService } from '@shared/services/api.service';
import { ISetting } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class SettingService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class SettingService
  extends BaseRestService<ISetting>
  implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<ISetting>}
   * @memberof SettingService
   */
  private _settingSubject: BehaviorSubject<ISetting> = new BehaviorSubject<ISetting>(
    null
  );

  /**
   *
   *
   * @type {Observable<ISetting>}
   * @memberof SettingService
   */
  public setting$: Observable<ISetting> = this._settingSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @param {IUser} setting
   * @memberof SettingService
   */
  public set setting(setting: ISetting) {
    this._settingSubject.next(setting);
  }

  /**
   *
   *
   * @returns {IUser}
   * @memberof SettingService
   */
  public get setting(): ISetting {
    return (this._settingSubject.getValue() as ISetting) as ISetting;
  }

  /**
   *
   *
   * @type {string}
   * @memberof SettingService
   */
  public endpoint: string = 'settings';

  /**
   *Creates an instance of SettingService.
   * @param {ApiService} _apiSvc
   * @memberof SettingService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
    this.init();
  }

  /**
   *
   *
   * @protected
   * @memberof SettingService
   */
  protected init(): void {
    this.setting = null;
    this._subscription.add(this.setting$.subscribe());
    this._subscription.add(this.getSetting$().subscribe());
  }

  /**
   *
   *
   * @return {Observable<ISetting>}
   * @memberof SettingService
   */
  public getSetting$(): Observable<ISetting> {
    return this.getAll$().pipe(
      filter((settings: ISetting[]) => _.isArray(settings)),
      filter((settings: ISetting[]) => _.size(settings) > 0),
      tap((settings: ISetting[]) => (this.data = settings)),
      map((settings: ISetting[]) => _.get(settings, '0')),
      tap((setting: ISetting) => (this.setting = setting)),
      take(1)
    );
  }

  /**
   *
   *
   * @return {Observable<ISetting>}
   * @memberof SettingService
   */
  public get hasAddress$(): Observable<boolean> {
    return this.setting$.pipe(
      skipWhile((setting: ISetting) => _.isEmpty(setting)),
      map((setting: ISetting) => !_.isEmpty(_.get(setting, 'address'))),
      distinctUntilChanged()
    );
  }
}
