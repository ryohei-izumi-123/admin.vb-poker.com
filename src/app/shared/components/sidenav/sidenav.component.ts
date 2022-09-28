import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, NavigationStart, Event as Event$ } from '@angular/router';
import { _ } from '@core/class/util';
import { distinctUntilChanged, filter, skipWhile } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { IMenu } from '@shared/interfaces/menu';
import { BaseComponent } from '@core/class/base.component';
import { DeviceDetectorService } from '@shared/services/device-detector.service';
import { MenuService } from '@shared/services/menu.service';

/**
 *
 *
 * @export
 * @class SidenavComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @type {IMenu[]}
   * @memberof SidenavComponent
   */
  public menus: IMenu[] = this._menuSvc.menus;

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof SidenavComponent
   */
  private _isCollapsed: boolean = true;

  /**
   *
   *
   * @type {boolean}
   * @memberof SidenavComponent
   */
  public get isCollapsed(): boolean {
    return this._isCollapsed;
  }

  /**
   *
   *
   * @memberof SidenavComponent
   */
  public set isCollapsed(isCollapsed: boolean) {
    this._isCollapsed = isCollapsed;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of SidenavComponent.
   * @param {MenuService} _menuSvc
   * @param {DeviceDetectorService} _deviceDetectorSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof SidenavComponent
   */
  public constructor(
    private _menuSvc: MenuService,
    private _deviceDetectorSvc: DeviceDetectorService,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof SidenavComponent
   */
  public ngOnInit() {
    this.isCollapsed = !this._deviceDetectorSvc.isDesktop;
    this._subscription.add(
      this._router.events
        .pipe(
          distinctUntilChanged(),
          filter(($event: Event$) => $event instanceof NavigationStart),
          skipWhile(() => this._deviceDetectorSvc.isDesktop)
        )
        .subscribe(() => (this.isCollapsed = true))
    );
    super.ngOnInit();
  }

  /**
   *
   *
   * @memberof SidenavComponent
   */
  public ngOnDestroy() {
    this.isCollapsed = true;
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {IMenu} menu
   * @returns {boolean}
   * @memberof SidenavComponent
   */
  public hasChildren(menu: IMenu): boolean {
    const children: IMenu[] = _.get(menu, 'children');
    return _.isArray(children) && _.size(children) > 0;
  }

  /**
   *
   *
   * @param {IMenu} menu
   * @return {string}
   * @memberof SidenavComponent
   */
  public getText(menu: IMenu): string {
    return this._menuSvc.getText(menu);
  }
}
