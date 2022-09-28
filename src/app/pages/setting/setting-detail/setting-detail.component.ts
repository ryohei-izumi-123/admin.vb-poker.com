import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { ISetting } from '@shared/interfaces';
import { SettingService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class SettingDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-setting-detail',
  templateUrl: './setting-detail.component.html',
  styleUrls: ['./setting-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingDetailComponent
  extends BaseDetailComponent<ISetting, SettingService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof SettingDetailComponent
   */
  public get hasAddress(): boolean {
    return !_.isEmpty(_.get(this.row, 'address'));
  }

  /**
   * Creates an instance of SettingDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {SettingService} _settingSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof SettingDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _settingSvc: SettingService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _settingSvc, _router, _route, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof SettingDetailComponent
   */
  public ngOnInit() {
    this._subscription.add(this.fromRouteData$().subscribe());
  }
}
