import { Inject, Injectable, OnDestroy } from '@angular/core';
import { _ } from '@core/class/util';
import {
  ToastrService as NgxToastrService,
  IndividualConfig as NgxToastrIndividualConfig,
} from 'ngx-toastr';
import { IToast, IToastParam } from '@shared/interfaces';
import { TToasterLevel } from '@shared/types';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class ToasterService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class ToasterService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @readonly
   * @type {NgxToastrIndividualConfig}
   * @memberof ToasterService
   */
  public get options(): NgxToastrIndividualConfig {
    return this._ngxToastrSvc.toastrConfig;
  }

  /**
   * Creates an instance of ToasterService.
   * @param {NgxToastrService} _ngxToastrSvc
   * @memberof ToasterService
   */
  public constructor(
    @Inject(NgxToastrService) private _ngxToastrSvc: NgxToastrService
  ) {
    super();
  }

  /**
   *
   *
   * @memberof ToasterService
   */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @readonly
   * @type {IToast<any>[]}
   * @memberof ToasterService
   */
  public get toasters(): IToast<any>[] {
    return this._ngxToastrSvc.toasts as IToast<any>[];
  }

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof ToasterService
   */
  public get active(): number {
    return this._ngxToastrSvc.currentlyActive;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof ToasterService
   */
  public get previous(): string {
    return this._ngxToastrSvc.previousToastMessage;
  }

  /**
   *
   *
   * @param {IToastParam} payload
   * @returns {IToast}
   * @memberof ToasterService
   */
  public show(payload: IToastParam): IToast {
    const type: TToasterLevel = _.get(payload, 'type') || 'info';
    const title: string = _.get(payload, 'title') || undefined;
    const message: string = _.get(payload, 'message') || undefined;
    const options: Partial<NgxToastrIndividualConfig> = _.get(
      payload,
      'options'
    );

    return this._ngxToastrSvc.show(message, title, options, type) as IToast;
  }

  /**
   *
   *
   * @param {number} toastId
   * @returns {boolean}
   * @memberof ToasterService
   */
  public remove(toastId: number): boolean {
    return this._ngxToastrSvc.remove(toastId);
  }

  /**
   *
   *
   * @param {number} [toastId=undefined]
   * @returns {void}
   * @memberof ToasterService
   */
  public clear(toastId: number = undefined): void {
    return this._ngxToastrSvc.clear(toastId);
  }

  /**
   *
   *
   * @returns {void}
   * @memberof ToasterService
   */
  public clearAll(): void {
    const toasters: IToast[] = this.toasters;
    for (const toaster of toasters) {
      this.clear(toaster.toastId);
    }
  }
}
