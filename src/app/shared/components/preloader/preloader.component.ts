import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class PreloaderComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreloaderComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof PreloaderComponent
   */
  private _clazz: string = null;

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof PreloaderComponent
   */
  public get clazz(): string {
    return this._clazz;
  }

  /**
   *
   *
   * @type {string}
   * @memberof PreloaderComponent
   */
  @Input()
  public set clazz(clazz: string) {
    this._clazz = clazz;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of PreloaderComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof PreloaderComponent
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
   * @memberof PreloaderComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
