import { ComponentRef } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastRef, ActiveToast, IndividualConfig } from 'ngx-toastr';
import { TToasterLevel } from '@shared/types/toaster-options';

/**
 *
 *
 * @export
 * @interface IToastParam
 */
export interface IToastParam {
  type: TToasterLevel;
  message?: string;
  title?: string;
  options?: Partial<IndividualConfig>;
}

/**
 *
 *
 * @export
 * @interface IToast
 * @extends {ActiveToast<T>}
 * @template T
 */
export interface IToast<T = any> extends ActiveToast<T> {
  toastId: number;
  message: string;
  portal: ComponentRef<T>;
  toastRef: ToastRef<T>;
  onShown: Observable<any>;
  onHidden: Observable<any>;
  onTap: Observable<any>;
  onAction: Observable<any>;
}
