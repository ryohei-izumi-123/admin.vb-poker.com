import { Inject, Injectable, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '@core/class/util';
import { BaseService } from '@core/class/base.service';
import { IMenu } from '@shared/interfaces/menu';

/**
 *
 * @export
 * @class MenuService
 */
@Injectable({
  providedIn: 'root',
})
export class MenuService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @type {IMenu[]}
   * @memberof MenuService
   */
  public menus: IMenu[] = [
    {
      path: '/home',
      text: 'home',
      icon: 'home',
    },
    {
      path: '/category',
      text: 'category',
      icon: 'blocks-group',
    },
    {
      path: '/product',
      text: 'product',
      icon: 'store',
    },
    {
      path: '/customer',
      text: 'customer',
      icon: 'users',
    },
    {
      path: '/user',
      text: 'user',
      icon: 'employee',
    },

    {
      path: '/order',
      text: 'order',
      icon: 'bundle',
    },
    {
      path: '/setting',
      text: 'setting',
      icon: 'cog',
    },
    {
      path: '/webpage',
      text: 'webpage',
      icon: 'application',
    },
    {
      path: '/language',
      text: 'language',
      icon: 'language',
    },
    {
      path: '/acl',
      text: 'acl',
      icon: 'slider',
    },
  ];

  /**
   * Creates an instance of MenuService.
   * @memberof MenuService
   */
  public constructor(
    @Inject(TranslateService) private _translateSvc: TranslateService
  ) {
    super();
  }

  /**
   *
   *
   * @param {IMenu} menu
   * @returns {string}
   * @memberof MenuService
   */
  public getText(menu: IMenu): string {
    const prefix: string = 'menu.';
    const text: string = _.get(menu, 'text');
    if (_.isEmpty(text)) {
      return '';
    }

    return this._translateSvc.instant(`${prefix}${text}`);
  }
}
