import { environment } from '@env/environment';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import {
  Router,
  Data as RouteData,
  ActivationEnd,
  NavigationStart,
  Event as Event$,
  NavigationExtras,
} from '@angular/router';
import { Subscription, fromEvent as fromEvent$ } from 'rxjs';
import {
  throttleTime,
  distinctUntilChanged,
  filter,
  map,
  debounceTime,
  take,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { IAvatar, IMenu } from '@shared/interfaces';
import { THeaderStyle } from '@shared/types';
import {
  DeviceDetectorService,
  MenuService,
  TourService,
} from '@shared/services';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class HeaderComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {IMenu[]}
   * @memberof HeaderComponent
   */
  public menus: IMenu[] = this._menuSvc.menus;

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof HeaderComponent
   */
  public get title(): string {
    return environment?.name;
  }

  /**
   *
   *
   * @private
   * @type {IAvatar}
   * @memberof HeaderComponent
   */
  private _avatar: IAvatar = null;

  /**
   *
   *
   * @type {IAvatar}
   * @memberof HeaderComponent
   */
  public get avatar(): IAvatar {
    return this._avatar;
  }

  /**
   *
   *
   * @memberof HeaderComponent
   */
  public set avatar(avatar: IAvatar) {
    this._avatar = avatar;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {THeaderStyle}
   * @memberof HeaderComponent
   */
  private _showHeaderSpan: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public get showHeaderSpan(): boolean {
    return this._showHeaderSpan;
  }

  /**
   *
   *
   * @memberof HeaderComponent
   */
  public set showHeaderSpan(showHeaderSpan: boolean) {
    if (!_.isNull(showHeaderSpan) && !_.isUndefined(showHeaderSpan)) {
      this._showHeaderSpan = showHeaderSpan;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   *
   *
   * @private
   * @type {THeaderStyle}
   * @memberof HeaderComponent
   */
  private _headerStyle: THeaderStyle = 'header-7';

  /**
   *
   *
   * @type {THeaderStyle}
   * @memberof HeaderComponent
   */
  public get headerStyle(): THeaderStyle {
    return this._headerStyle;
  }

  /**
   *
   *
   * @memberof HeaderComponent
   */
  public set headerStyle(headerStyle: THeaderStyle) {
    if (!_.isNull(headerStyle) && !_.isUndefined(headerStyle)) {
      this._headerStyle = headerStyle;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public get isScrolled(): boolean {
    return window.scrollY > 0;
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof HeaderComponent
   */
  private _isNavbarOpened: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public get isNavbarOpened(): boolean {
    return this._isNavbarOpened;
  }

  /**
   *
   *
   * @memberof HeaderComponent
   */
  public set isNavbarOpened(opened: boolean) {
    this._isNavbarOpened = opened;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof HeaderComponent
   */
  public get isDesktop(): boolean {
    return this._deviceDetectorSvc.isDesktop;
  }

  /**
   * Creates an instance of HeaderComponent.
   * @param {TourService} _tourSvc
   * @param {MenuService} _menuSvc
   * @param {DeviceDetectorService} _deviceDetectorSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof HeaderComponent
   */
  public constructor(
    private _tourSvc: TourService,
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
   * @param {MouseEvent} $event
   * @memberof HeaderComponent
   */
  @HostListener('window:scroll', ['$event'])
  public onWindowScroll($event: UIEvent) {}

  /**
   *
   *
   * @memberof HeaderComponent
   */
  public ngOnInit() {
    this._subscription.add(
      this._router.events
        .pipe(
          distinctUntilChanged(),
          filter(($event: Event$) => $event instanceof ActivationEnd),
          map(($event: Event$) => _.get($event, 'snapshot.data') as RouteData)
        )
        .subscribe(($data: RouteData) => {
          this.headerStyle = _.get($data, 'headerStyle') as THeaderStyle;
          this.showHeaderSpan = _.get($data, 'showHeaderSpan') as boolean;
        })
    );

    this._subscription.add(
      this._router.events
        .pipe(
          filter(($event: Event$) => $event instanceof NavigationStart),
          debounceTime(100)
        )
        .subscribe(() => {
          this.isNavbarOpened = false;
        })
    );

    this._subscription.add(
      fromEvent$(window, 'scroll')
        .pipe(distinctUntilChanged(), throttleTime(100))
        .subscribe(() => this._changeDetectorRef.markForCheck())
    );

    this.initTour();
  }

  /**
   *
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @private
   * @return {void}
   * @memberof HeaderComponent
   */
  private initTour(): any {
    this._tourSvc.steps = this.isDesktop
      ? ['step1', 'step2', 'step3', 'step4']
      : ['step1', 'step3', 'step4'];
    this._subscription.add(this._tourSvc.startIfFirst());
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof HeaderComponent
   */
  public toggleNavbar($event: MouseEvent): void {
    this.isNavbarOpened = !!!this.isNavbarOpened;
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof HeaderComponent
   */
  public closeNavbar($event: MouseEvent): void {
    this.isNavbarOpened = false;
  }

  /**
   *
   *
   * @param {IMenu} menu
   * @return {string}
   * @memberof HeaderComponent
   */
  public getText(menu: IMenu): string {
    return this._menuSvc.getText(menu);
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof HeaderComponent
   */
  public logout(): Subscription {
    const duration: number = 1000;
    const commands: any[] = ['/logout'];
    const navigationExtras: NavigationExtras = {
      queryParams: {
        message: this.translate('errors.logoutSuccess'),
        type: 'success',
      },
      queryParamsHandling: 'merge',
    };

    return this._subscription.add(
      this.navigate$(commands, navigationExtras, duration)
        .pipe(take(1))
        .subscribe()
    );
  }
}
