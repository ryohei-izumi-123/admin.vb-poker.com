import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Injector,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ToastPackage as NgxToastPackage,
  ToastrService as NgxToastrService,
} from 'ngx-toastr';
import { ToasterAnimation } from '@core/class/app-animation';
import { BaseToasterComponent } from '@core/class/base-toaster.component';

/**
 *
 * @see https://github.com/scttcper/ngx-toastr/blob/master/src/app/pink.toast.ts
 * @see https://ngx-toastr.netlify.com/
 * @export
 * @class ToasterComponent
 * @extends {BaseToasterComponent}
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ToasterAnimation,
  preserveWhitespaces: false,
})
export class ToasterComponent
  extends BaseToasterComponent
  implements OnInit, OnDestroy {
  /**
   *Creates an instance of ToasterComponent.
   * @param {NgxToastrService} _toastrSvc
   * @param {NgxToastPackage} _toastPkg
   * @param {Injector} _injector
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ToasterComponent
   */
  public constructor(
    protected _toastrSvc: NgxToastrService,
    protected _toastPkg: NgxToastPackage,
    protected _injector: Injector,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _toastrSvc,
      _toastPkg,
      _injector,
      _router,
      _route,
      _changeDetectorRef
    );
  }
}
