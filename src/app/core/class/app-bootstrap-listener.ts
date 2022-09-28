import { Injector, Injectable, ComponentRef } from '@angular/core';
import { LoggerService } from '@shared/services/logger.service';

/**
 *
 * @export
 * @class AppBootstrapListener
 */
@Injectable({
  providedIn: 'root',
})
export class AppBootstrapListener {
  /**
   *Creates an instance of AppBootstrapListener.
   * @param {Injector} _injector
   * @memberof AppBootstrapListener
   */
  public constructor(private _injector: Injector) {}

  /**
   *
   * @description アプリケーションの起動時に一度だけ行う処理を登録できる。ここでは特にすることはないのでログ出力している。
   * @param {ComponentRef<any>} component
   * @memberof AppBootstrapListener
   */
  public init(component: ComponentRef<any>): void {
    const _loggerSvc: LoggerService = this._injector.get(LoggerService);
    _loggerSvc.info(`Boot root component`, component.instance);
  }
}

export const AppBootstrapListenerFactory = (listener: AppBootstrapListener) => {
  return (componentRef: ComponentRef<any>) => listener.init(componentRef);
};
