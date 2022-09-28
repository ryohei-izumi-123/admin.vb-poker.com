import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  SimpleChanges,
  Input,
} from '@angular/core';
import { TContentAreaStyle } from '@shared/types';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class ContentContainerComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentContainerComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {TContentAreaStyle}
   * @memberof ContentContainerComponent
   */
  private _contentAreaStyle: TContentAreaStyle = '';

  /**
   *
   *
   * @readonly
   * @type {TContentAreaStyle}
   * @memberof ContentContainerComponent
   */
  public get contentAreaStyle(): TContentAreaStyle {
    return this._contentAreaStyle;
  }

  /**
   *
   *
   * @readonly
   * @type {TContentAreaStyle}
   * @memberof ContentContainerComponent
   */
  @Input()
  public set contentAreaStyle(contentAreaStyle: TContentAreaStyle) {
    this._contentAreaStyle = contentAreaStyle;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof ContentContainerComponent
   */
  private _hasSidenav: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof ContentContainerComponent
   */
  public get hasSidenav(): boolean {
    return this._hasSidenav;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof ContentContainerComponent
   */
  @Input()
  public set hasSidenav(hasSidenav: boolean) {
    this._hasSidenav = hasSidenav;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of ContentContainerComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ContentContainerComponent
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
   * @memberof ContentContainerComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
