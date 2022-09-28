import {
  Input,
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ILinkOptions } from '@shared/interfaces';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class LinkComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @protected
   * @type {ILinkOptions}
   * @memberof LinkComponent
   */
  protected _options: ILinkOptions = {
    icon: {
      size: 16,
      shape: 'undo',
    },
    clazz: 'btn btn-sm btn-link',
    link: ['/home'],
  };

  /**
   *
   *
   * @type {ILinkOptions}
   * @memberof LinkComponent
   */
  public get options(): ILinkOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof LinkComponent
   */
  @Input()
  public set options(options: ILinkOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof LinkComponent
   */
  private _disabled: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof LinkComponent
   */
  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof LinkComponent
   */
  @Input()
  public set disabled(disabled: boolean) {
    this._disabled = disabled;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of LinkComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LinkComponent
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
   * @memberof LinkComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
