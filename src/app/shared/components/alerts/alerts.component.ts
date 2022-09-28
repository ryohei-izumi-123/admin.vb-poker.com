import {
  Input,
  Output,
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { IAlertOption } from '@shared/interfaces';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class AlertsComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertsComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof AlertsComponent
   */
  @Output()
  public closed$: EventEmitter<boolean> = new EventEmitter();

  /**
   *
   * @private
   * @type {IAlertOption[]}
   * @memberof AlertsComponent
   */
  private _options: IAlertOption[] = [];

  /**
   *
   *
   * @readonly
   * @type {IAlertOption[]}
   * @memberof AlertsComponent
   */
  public get options(): IAlertOption[] {
    return this._options;
  }

  /**
   *
   *
   * @type {IAlertOption[]}
   * @memberof AlertsComponent
   */
  @Input()
  public set options(options: IAlertOption[]) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of AlertsComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AlertsComponent
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
   * @memberof AlertsComponent
   */
  public ngOnDestroy() {
    this.closed$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @memberof AlertsComponent
   */
  public onClose(): void {
    this.closed$.emit(true);
  }
  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof AlertsComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}
}
