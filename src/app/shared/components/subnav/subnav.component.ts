import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';
import { IMenu } from '@shared/interfaces/menu';
import { MenuService } from '@shared/services/menu.service';

/**
 *
 *
 * @export
 * @class SubnavComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-subnav',
  templateUrl: './subnav.component.html',
  styleUrls: ['./subnav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubnavComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @type {IMenu[]}
   * @memberof SubnavComponent
   */
  public menus: IMenu[] = this._menuSvc.menus;

  /**
   * Creates an instance of SubnavComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof SubnavComponent
   */
  public constructor(
    private _menuSvc: MenuService,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @param {IMenu} menu
   * @return {string}
   * @memberof SubnavComponent
   */
  public getText(menu: IMenu): string {
    return this._menuSvc.getText(menu);
  }
}
