/// <reference types="network-information-types" />
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class NetworkService
 * @extends {BaseService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class NetworkService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof NetworkService
   */
  private _statusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    window.navigator.onLine
  );

  /**
   *
   *
   * @param {boolean} status
   * @memberof NetworkService
   */
  public set status(status: boolean) {
    this._statusSubject.next(status);
  }

  /**
   *
   *
   * @returns {boolean}
   * @memberof NetworkService
   */
  public get status(): boolean {
    return this._statusSubject.getValue() as boolean;
  }

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof NetworkService
   */
  public status$: Observable<boolean> = this._statusSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<NetworkInformation>}
   * @memberof NetworkService
   */
  private _connectionSubject: BehaviorSubject<NetworkInformation> = new BehaviorSubject<NetworkInformation>(
    navigator.connection
  );

  /**
   *
   *
   * @param {NetworkInformation} connection
   * @memberof NetworkService
   */
  public set connection(connection: NetworkInformation) {
    this._connectionSubject.next(connection);
  }

  /**
   *
   *
   * @returns {NetworkInformation}
   * @memberof NetworkService
   */
  public get connection(): NetworkInformation {
    return this._connectionSubject.getValue() as NetworkInformation;
  }

  /**
   *
   *
   * @type {Observable<NetworkInformation>}
   * @memberof NetworkService
   */
  public connection$: Observable<NetworkInformation> = this._connectionSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   * Creates an instance of NetworkService.
   * @param {EventManager} _eventManager
   * @memberof NetworkService
   */
  public constructor(
    @Inject(EventManager) private _eventManager: EventManager
  ) {
    super();
    this.init();
  }

  /**
   *
   *
   * @protected
   * @memberof NetworkService
   */
  protected init(): void {
    this._subscription.add(this.status$.subscribe());
    this._subscription.add(this.connection$.subscribe());
    this._eventManager.addGlobalEventListener('window', 'online', () =>
      this._setStatus(true)
    );
    this._eventManager.addGlobalEventListener('window', 'offline', () =>
      this._setStatus(false)
    );
  }

  /**
   *
   *
   * @private
   * @param {boolean} status
   * @memberof NetworkService
   */
  private _setStatus(status: boolean): void {
    this.status = status;
    this.connection = navigator.connection;
  }

  /**
   *
   *
   * @memberof NetworkService
   */
  public ngOnDestroy() {
    this._connectionSubject.complete();
    this._statusSubject.complete();
    this._subscription.unsubscribe();
  }
}
