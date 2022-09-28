import { Inject, Injectable, OnDestroy, NgZone } from '@angular/core';
import {
  SwUpdate,
  UpdateAvailableEvent,
  UpdateActivatedEvent,
} from '@angular/service-worker';
import { EventManager } from '@angular/platform-browser';
import {
  Observable,
  BehaviorSubject,
  interval as interval$,
  from as fromPromise$,
} from 'rxjs';
import {
  filter,
  distinctUntilChanged,
  take,
  tap,
  map,
  finalize,
  concatMap,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { LoggerService } from '@shared/services/logger.service';
import {
  IBeforeInstallPromptEvent,
  IBeforeInstallUserChoice,
} from '@shared/interfaces';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class UpdateService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class UpdateService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<IBeforeInstallPromptEvent>}
   * @memberof UpdateService
   */
  private _deferredPromptSubject: BehaviorSubject<IBeforeInstallPromptEvent> = new BehaviorSubject<IBeforeInstallPromptEvent>(
    null
  );

  /**
   *
   *
   * @type {Observable<IBeforeInstallPromptEvent>}
   * @memberof UpdateService
   */
  public deferredPrompt$: Observable<IBeforeInstallPromptEvent> = this._deferredPromptSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {IBeforeInstallPromptEvent}
   * @memberof UpdateService
   */
  public get deferredPrompt(): IBeforeInstallPromptEvent {
    return this._deferredPromptSubject.getValue();
  }

  /**
   *
   *
   * @param {IBeforeInstallPromptEvent} result
   * @returns {void}
   * @memberof UpdateService
   */
  public set deferredPrompt(deferredPrompt: IBeforeInstallPromptEvent) {
    this._deferredPromptSubject.next(deferredPrompt);
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof UpdateService
   */
  private _interval: number = 60000;

  /**
   *Creates an instance of UpdateService.
   * @param {LoggerService} _loggerSvc
   * @param {NgZone} _ngZone
   * @param {SwUpdate} _swUpdate
   * @param {EventManager} _eventManager
   * @memberof UpdateService
   */
  public constructor(
    @Inject(LoggerService) private _loggerSvc: LoggerService,
    @Inject(NgZone) private _ngZone: NgZone,
    @Inject(SwUpdate) private _swUpdate: SwUpdate,
    @Inject(EventManager) private _eventManager: EventManager
  ) {
    super();
    this.init();
  }

  /**
   *
   *
   * @private
   * @memberof UpdateService
   */
  private init(): void {
    this._eventManager.addGlobalEventListener(
      'window',
      'beforeinstallprompt',
      this.handleBeforeInstallPrompt.bind(this)
    );

    if (this._swUpdate.isEnabled) {
      this._subscription.add(
        this._swUpdate.activated.subscribe(($event: UpdateActivatedEvent) => {
          this._loggerSvc.info(
            `[SERVICE WORKER] --UpdateActivatedEvent-- previous version: ${$event.previous} current version: ${$event.current}`
          );
        })
      );

      this._ngZone.runOutsideAngular(() => {
        interval$(this._interval).subscribe(() => {
          this._loggerSvc.info(
            `[SERVICE WORKER] checkForUpdate on @UpdateService`
          );
          this._ngZone.run(() => this._swUpdate.checkForUpdate());
        });
      });

      this._subscription.add(
        this._swUpdate.available.subscribe(($event: UpdateAvailableEvent) => {
          this._loggerSvc.info(
            `[SERVICE WORKER] --UpdateAvailableEvent-- current version: ${$event.current} available version: ${$event.available}`
          );

          this._swUpdate
            .activateUpdate()
            .then(() => document.location.reload())
            .catch((error: Error) =>
              this._loggerSvc.warn(
                `[SERVICE WORKER] --activateUpdate-- ERROR: ${error}`
              )
            );
        })
      );
    }
  }

  /**
   *
   *
   * @param {IBeforeInstallPromptEvent} $event
   * @memberof UpdateService
   */
  public handleBeforeInstallPrompt($event: IBeforeInstallPromptEvent): void {
    try {
      $event.preventDefault();
      this.deferredPrompt = $event;
      this._loggerSvc.info(
        `EVENT RAISED UpdateService.handleBeforeInstallPrompt`,
        $event
      );
    } catch (error) {
      this._loggerSvc.error(
        `ERROR RAISED UpdateService.handleBeforeInstallPrompt CATCH ERROR:`,
        error
      );
    }
  }

  /**
   *
   *
   * @returns {Observable<boolean>}
   * @memberof UpdateService
   */
  public showPrompt$(): Observable<boolean> {
    return this.deferredPrompt$
      .pipe(
        filter(($event: IBeforeInstallPromptEvent) => !!!_.isEmpty($event)),
        take(1)
      )
      .pipe(tap(($event: IBeforeInstallPromptEvent) => $event.prompt()))
      .pipe(
        concatMap(($event: IBeforeInstallPromptEvent) =>
          fromPromise$($event.userChoice)
        ),
        map((result: IBeforeInstallUserChoice) => result.outcome === 'accepted')
      )
      .pipe(finalize(() => (this.deferredPrompt = null)));
  }
}
