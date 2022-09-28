import {
  Input,
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IButtonGroupOptions } from '@shared/interfaces';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 * @deprecated
 * @description パフォーマンスが良くないので基本的には使わない。
 * @export
 * @class ButtonGroupComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @protected
   * @type {IButtonGroupOptions}
   * @memberof ButtonGroupComponent
   */
  protected _options: IButtonGroupOptions = {
    position: 'bottom-right',
    clazz: '',
    buttons: [],
  };

  /**
   *
   *
   * @type {IButtonGroupOptions}
   * @memberof ButtonGroupComponent
   */
  public get options(): IButtonGroupOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof ButtonGroupComponent
   */
  @Input()
  public set options(options: IButtonGroupOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of ButtonGroupComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ButtonGroupComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof ButtonGroupComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @memberof ButtonGroupComponent
   */
  public ngAfterViewInit() {}
}
