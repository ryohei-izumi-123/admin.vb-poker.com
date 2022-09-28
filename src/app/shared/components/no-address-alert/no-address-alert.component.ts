import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';
import { IAlertOption } from '@shared/interfaces';
import { SettingService } from '@shared/services/setting.service';
import { AlertComponent } from '@shared/components/alert/alert.component';

/**
 *
 *
 * @export
 * @class NoAddressAlertComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-no-address-alert',
  templateUrl: './no-address-alert.component.html',
  styleUrls: ['./no-address-alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoAddressAlertComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {AlertComponent}
   * @memberof NoAddressAlertComponent
   */
  @ViewChild('$alert')
  public $alert: AlertComponent;

  /**
   *
   * @private
   * @type {boolean}
   * @memberof NoAddressAlertComponent
   */
  private _visible: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof NoAddressAlertComponent
   */
  public get visible(): boolean {
    return this._visible;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof NoAddressAlertComponent
   */
  public set visible(visible: boolean) {
    this._visible = visible;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   * @private
   * @type {IAlertOption}
   * @memberof NoAddressAlertComponent
   */
  private _options: IAlertOption = {
    level: 'danger',
    icon: 'error',
    isClosable: false,
    isAppLevel: true,
  };

  /**
   *
   *
   * @readonly
   * @type {IAlertOption}
   * @memberof NoAddressAlertComponent
   */
  public get options(): IAlertOption {
    return this._options;
  }

  /**
   *
   *
   * @type {IAlertOption}
   * @memberof NoAddressAlertComponent
   */
  public set options(options: IAlertOption) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of NoAddressAlertComponent.
   * @param {SettingService} _settingSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof NoAddressAlertComponent
   */
  public constructor(
    private _settingSvc: SettingService,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof NoAddressAlertComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._settingSvc.hasAddress$.subscribe(
        (hasAddress: boolean) => (this.visible = !hasAddress)
      )
    );
  }

  /**
   *
   *
   * @memberof NoAddressAlertComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @memberof NoAddressAlertComponent
   */
  public close(): void {
    this.$alert.close();
    this._subscription.add(
      this.navigate$(['/setting/update'])
        .pipe(take(1))
        .subscribe(() => (this.visible = false))
    );
  }
}
