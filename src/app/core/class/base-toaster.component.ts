import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Injector,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  Toast as NgxToastComponent,
  ToastPackage as NgxToastPackage,
  ToastrService as NgxToastrService,
} from 'ngx-toastr';
import { ToasterAnimation } from '@core/class/app-animation';
import { TToasterLevel } from '@shared/types';

/**
 *
 * @see https://github.com/scttcper/ngx-toastr/blob/master/src/app/pink.toast.ts
 * @see https://ngx-toastr.netlify.com/
 * @export
 * @class BaseToasterComponent
 * @extends {NgxToastComponent}
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-toaster',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ToasterAnimation,
  preserveWhitespaces: false,
})
export abstract class BaseToasterComponent
  extends NgxToastComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @readonly
   * @type {TToasterLevel}
   * @memberof BaseToasterComponent
   */
  public get type(): TToasterLevel {
    return this._toastPkg.toastType as TToasterLevel;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof BaseToasterComponent
   */
  public get icon(): string {
    return `${this.type}-standard`;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseToasterComponent
   */
  public get isSuccess(): boolean {
    return this.type === 'success';
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseToasterComponent
   */
  public get isInfo(): boolean {
    return this.type === 'info';
  }
  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseToasterComponent
   */
  public get isWarning(): boolean {
    return this.type === 'warning';
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseToasterComponent
   */
  public get isError(): boolean {
    return this.type === 'error';
  }

  /**
   *
   *
   * @protected
   * @type {Subscription}
   * @memberof BaseToasterComponent
   */
  protected _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of BaseToasterComponent.
   * @param {NgxToastrService} _toastrSvc
   * @param {NgxToastPackage} _toastPkg
   * @param {Injector} _injector
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseToasterComponent
   */
  public constructor(
    protected _toastrSvc: NgxToastrService,
    protected _toastPkg: NgxToastPackage,
    protected _injector: Injector,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_toastrSvc, _toastPkg);
  }

  /**
   *
   *
   * @memberof BaseToasterComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof BaseToasterComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
    super.ngOnDestroy();
  }
}
