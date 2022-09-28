import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Subscription, Observable, NEVER as NEVER$ } from 'rxjs';
import { JoyrideService } from 'ngx-joyride';
import { TranslateService } from '@ngx-translate/core';
import { APP_TOUR_TOKEN, toTokenize } from '@shared/tokens';
import { StorageService } from '@shared/services/storage.service';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class TourService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class TourService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {string[]}
   * @memberof TourService
   */
  private _steps: string[] = [];
  /**
   *
   *
   * @readonly
   * @type {string[]}
   * @memberof TourService
   */
  public set steps(steps: string[]) {
    this._steps = steps;
  }

  /**
   *
   *
   * @readonly
   * @type {string[]}
   * @memberof TourService
   */
  public get steps(): string[] {
    return this._steps;
  }

  /**
   * Creates an instance of TourService.
   * @param {TranslateService} _translateSvc
   * @param {StorageService} _storageSvc
   * @param {JoyrideService} _joyrideSvc
   * @memberof TourService
   */
  public constructor(
    @Inject(TranslateService) private _translateSvc: TranslateService,
    @Inject(StorageService) private _storageSvc: StorageService,
    @Inject(JoyrideService) private readonly _joyrideSvc: JoyrideService
  ) {
    super();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof TourService
   */
  public get isInProgress(): boolean {
    return this._joyrideSvc.isTourInProgress();
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof TourService
   */
  public startIfFirst(): Subscription {
    const token: string = toTokenize(APP_TOUR_TOKEN);
    if (this._storageSvc.get(token)) {
      return this._subscription.add(NEVER$.subscribe());
    }

    this._storageSvc.set(token, true);

    return this._subscription.add(this.start$().subscribe());
  }

  /**
   *
   *
   * @return {Observable<any>}
   * @memberof TourService
   */
  public start$(): Observable<any> {
    const steps: string[] = this.steps;
    const waitingTime: number = 1;
    const customTexts: any = {
      prev: this.translate('common.previous'),
      next: this.translate('common.next'),
      done: this.translate('common.ok'),
    };

    return this._joyrideSvc.startTour({ steps, waitingTime, customTexts });
  }

  /**
   *
   *
   * @return {void}
   * @memberof TourService
   */
  public close(): void {
    return this._joyrideSvc.closeTour();
  }

  /**
   *
   *
   * @memberof TourService
   */
  public ngOnDestroy() {}

  /**
   *
   *
   * @param {string} key
   * @param {*} [params={}]
   * @returns {string}
   * @memberof TourService
   */
  public translate(key: string, params: any = {}): string {
    return this._translateSvc.instant(key, params);
  }
}
