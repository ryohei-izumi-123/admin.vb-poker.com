import { environment } from '@env/environment';
import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
// import { HttpParams } from '@angular/common/http';
// import { Observable, BehaviorSubject, EMPTY as EMPTY$ } from 'rxjs';
// import { take, map, distinctUntilChanged, retry } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { ISocketOptions } from '@shared/interfaces';
import { JwtService } from '@shared/services/jwt.service';
import { LoggerService } from '@shared/services/logger.service';
import { SOCKET_OPTIONS } from '@shared/tokens';
import { BaseService } from '@core/class/base.service';
import { io, Socket as ISocket } from 'socket.io-client';

@Injectable({
  providedIn: 'any',
})
export class SocketService extends BaseService implements OnDestroy {
  /**
   *
   * @type {ISocketOptions}
   * @memberof SocketService
   */
  public options: ISocketOptions = {
    autoConnect: false,
    forceNew: true,
    reconnection: false,
  };

  /**
   *
   *
   * @type {ISocket}
   * @memberof SocketService
   */
  public io: ISocket = null;

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof SocketService
   */
  public get id() {
    return this.io.id;
  }

  /**
   * Creates an instance of SocketService.
   * @param {ISocketOptions} _options
   * @param {JwtService} _jwtSvc
   * @param {LoggerService} _loggerSvc
   * @memberof SocketService
   */
  public constructor(
    @Inject(SOCKET_OPTIONS) _options: ISocketOptions,
    @Inject(JwtService) private _jwtSvc: JwtService,
    @Inject(LoggerService) private _loggerSvc: LoggerService
  ) {
    super();
    this.init(_options);
  }

  /**
   *
   *
   * @memberof SocketService
   */
  public init(options: ISocketOptions): void {
    this.disconnect();
    this._setOptions(options);
    this.io = io(environment.api.endpoint.socket, this.options);
    this._initHandlers();
    this.connect();
  }

  /**
   *
   *
   * @private
   * @memberof SocketService
   */
  private _initHandlers(): void {
    this._setHandler('connect', () =>
      this._loggerSvc.info('[SocketService] event: connect')
    );
    this._setHandler('disconnect', () =>
      this._loggerSvc.info('[SocketService] event: disconnect')
    );
    this._setHandler('reconnect', (attempt: number) =>
      this._loggerSvc.info('[SocketService] event: reconnect', attempt)
    );
    this._setHandler('reconnect_error', (error: Error) =>
      this._loggerSvc.error('[SocketService] event: reconnect_error', error)
    );
    this._setHandler('reconnect_attempt', (attempt: number) =>
      this._loggerSvc.warn('[SocketService] event: reconnect_attempt', attempt)
    );
    this._setHandler('reconnect_failed', () =>
      this._loggerSvc.warn('[SocketService] event: reconnect_failed')
    );
    this._setHandler('ping', () =>
      this._loggerSvc.info('[SocketService] event: ping')
    );
    this._setHandler('error', (error) =>
      this._loggerSvc.error('[SocketService] event: error', error)
    );
  }

  /**
   *
   *
   * @private
   * @param {string} key
   * @param {Function} [callback=(args?: any) => undefined]
   * @param {boolean} [once=false]
   * @memberof SocketService
   */
  private _setHandler(
    key: string,
    callback: any = (args?: any) => undefined,
    once: boolean = false
  ): void {
    if (_.isFunction(callback)) {
      once ? this.io.once(key, callback) : this.io.on(key, callback);
    }
  }

  /**
   *
   *
   * @private
   * @param {ISocketOptions} [options={ path: undefined }]
   * @memberof SocketService
   */
  private _setOptions(options: ISocketOptions = { path: undefined }): void {
    if (!_.isObjectLike(options)) {
      options = {};
    }

    _.set(options, 'auth', this._setAuth.bind(this));
    this.options = _.assign(_.cloneDeep(this.options), options);
  }

  /**
   *
   *
   * @private
   * @param {(args: any) => any} callback
   * @memberof SocketService
   */
  private _setAuth(callback: (args: any) => any) {
    const token: string = this._jwtSvc.get();
    if (_.isFunction(callback)) {
      callback({
        token,
      });
    }
  }

  /**
   *
   * @deprecated
   * @private
   * @memberof SocketService
   */
  private _setAuthorizationHeaders() {
    const token: string = this._jwtSvc.get();
    if (!_.isEmpty(token)) {
      _.set(this.options, 'extraHeaders', {
        Authorization: `bearer ${token}`,
      });
    }
  }

  /**
   *
   *
   * @memberof SocketService
   */
  public connect() {
    if (this.io) {
      if (!this.io.connected) {
        this.io.connect();
      }
    }
  }

  /**
   *
   *
   * @memberof SocketService
   */
  public disconnect() {
    if (this.io) {
      if (!this.io.disconnected) {
        this.io.disconnect();
      }
    }
  }

  /**
   *
   *
   * @memberof SocketService
   */
  public reconnect() {
    this.disconnect();
    this.connect();
  }

  /**
   *
   *
   * @memberof SocketService
   */
  public ngOnDestroy() {
    this.disconnect();
    super.ngOnDestroy();
  }
}

/**
 *
 * @param {ISocketOptions} _options
 * @param {JwtService} _jwtSvc
 * @param {LoggerService} _loggerSvc
 * @returns {SocketService}
 */
export const SocketFactory = (
  _options: ISocketOptions,
  _jwtSvc: JwtService,
  _loggerSvc: LoggerService
) => new SocketService(_options, _jwtSvc, _loggerSvc);
