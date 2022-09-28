import {
  Input,
  Output,
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { IAlertOption } from '@shared/interfaces';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';
import { ClrAlert } from '@clr/angular';

/**
 *
 *
 * @export
 * @class AlertComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @type {ClrAlert}
   * @memberof AlertComponent
   */
  @ViewChild('$alert')
  public $alert: ClrAlert;

  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof AlertComponent
   */
  @Output()
  public closed$: EventEmitter<boolean> = new EventEmitter();

  /**
   *
   * @private
   * @type {IAlertOption}
   * @memberof AlertComponent
   */
  private _options: IAlertOption = null;

  /**
   *
   *
   * @readonly
   * @type {IAlertOption}
   * @memberof AlertComponent
   */
  public get options(): IAlertOption {
    return this._options;
  }

  /**
   *
   *
   * @type {IAlertOption}
   * @memberof AlertComponent
   */
  @Input()
  public set options(options: IAlertOption) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of AlertComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AlertComponent
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
   * @memberof AlertComponent
   */
  public ngOnDestroy() {
    this.closed$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @memberof AlertComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @memberof AlertComponent
   */
  public onClose(): void {
    this.closed$.emit(true);
  }
  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof AlertComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @memberof AlertComponent
   */
  public close(): void {
    this.options.isClosable = true;
    this._changeDetectorRef.detectChanges();

    return this.$alert.close();
  }
}
