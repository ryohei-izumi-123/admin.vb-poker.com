import {
  Directive,
  OnInit,
  OnDestroy,
  OnChanges,
  ChangeDetectorRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  Inject,
} from '@angular/core';
import { _ } from '@core/class/util';
import { BaseIfDirective } from '@core/class/base-if.directive';
import { DeviceDetectorService } from '@shared/services/device-detector.service';

/**
 *
 *
 * @export
 * @example `<div *ngIfMobile="'isDesktop'">Only shown when device is desktop.</div>`
 * @class IfMobileDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[ngIfMobile], [ngIfMobileElse]',
})
export class IfMobileDirective
  extends BaseIfDirective
  implements OnInit, OnDestroy, OnChanges {
  /**
   * Creates an instance of IfMobileDirective.
   * @param {DeviceDetectorService} _deviceDetectorSvc
   * @param {TemplateRef<any>} _templateRef
   * @param {ViewContainerRef} _viewContainerRef
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof IfMobileDirective
   */
  public constructor(
    @Inject(DeviceDetectorService)
    private _deviceDetectorSvc: DeviceDetectorService,
    protected _templateRef: TemplateRef<any>,
    protected _viewContainerRef: ViewContainerRef,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_templateRef, _viewContainerRef, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof IfMobileDirective
   */
  @Input()
  public set ngIfMobileElse(elseTemplateRef: TemplateRef<any>) {
    this.elseTemplateRef = elseTemplateRef;
  }

  /**
   *
   *
   * @memberof IfMobileDirective
   */
  @Input()
  public set ngIfMobile(
    param: 'isMobile' | 'isTablet' | 'isDesktop' | boolean
  ) {
    let condition: boolean = false;
    if (_.isBoolean(param)) {
      condition = param;
    }

    if (_.isString(param) && param in this._deviceDetectorSvc) {
      condition = _.get(this._deviceDetectorSvc, param);
    }

    this.condition = condition;
  }
}
