import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { moment } from '@core/class/util';
import { ClockService } from '@shared/services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class ClockComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent extends BaseComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @private
   * @type {moment.MomentInput}
   * @memberof ClockComponent
   */
  private _time: moment.MomentInput = null;

  /**
   *
   *
   * @readonly
   * @type {moment.MomentInput}
   * @memberof ClockComponent
   */
  public set time(time: moment.MomentInput) {
    this._time = time;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {moment.MomentInput}
   * @memberof ClockComponent
   */
  public get time(): moment.MomentInput {
    return this._time;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof ClockComponent
   */
  public get timezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  /**
   * Creates an instance of ClockComponent.
   * @param {ClockService} _clockSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ClockComponent
   */
  public constructor(
    private _clockSvc: ClockService,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof ClockComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._clockSvc.clock$.subscribe(
        (time: moment.Moment) => (this.time = time)
      )
    );
  }
}
