import liff from '@line/liff';
/// <reference types="gapi.auth2" />
import { environment } from '@env/environment';
import {
  Inject,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import {
  Router,
  ActivatedRoute,
  ActivationEnd,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  Event as Event$,
  Params as RouteParams,
} from '@angular/router';
import { ViewportScroller, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Observable, partition as partition$ } from 'rxjs';
import {
  tap,
  delay,
  filter,
  concatMap,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { LoggerService } from '@shared/services/logger.service';
import { UpdateService } from '@shared/services/update.service';
import { ToasterService } from '@shared/services/toaster.service';
import { GoogleLoginService } from '@shared/services/google-login.service';
import { FacebookLoginService } from '@shared/services/facebook-login.service';
import { LineLoginService } from '@shared/services/line-login.service';
import {
  IToastParam,
  ILayoutData,
  IBeforeInstallPromptEvent,
} from '@shared/interfaces';
import { BaseComponent } from '@core/class/base.component';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @private
   * @type {ILayoutData}
   * @memberof AppComponent
   */
  private _layout: ILayoutData = {
    title: environment.name,
    appLevelAlert: true,
    header: false,
    sidenav: false,
    subnav: false,
    footer: false,
    showHeaderSpan: false,
    headerStyle: 'header-7',
    wrapperClass: '',
    containerStyle: 'content-container',
    contentAreaStyle: 'content-area',
  };

  /**
   *
   *
   * @readonly
   * @type {ILayoutData}
   * @memberof AppComponent
   */
  public get layout(): ILayoutData {
    return this._layout;
  }

  /**
   *
   *
   * @readonly
   * @type {ILayoutData}
   * @memberof AppComponent
   */
  public set layout(layout: ILayoutData) {
    this._layout = layout;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @memberof AppComponent
   */
  public set title(title: string) {
    this._title.setTitle(title);
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @type {string}
   * @memberof AppComponent
   */
  public get title(): string {
    return this._title.getTitle() || environment.name;
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof AppComponent
   */
  @HostListener('document:contextmenu', ['$event'])
  public onContextMenu($event: MouseEvent): void {
    if (environment.production) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  /**
   *
   *
   * @param {IBeforeInstallPromptEvent} $event
   * @memberof AppComponent
   */
  @HostListener('window:beforeinstallprompt', ['$event'])
  public onBeforeInstallPrompt($event: IBeforeInstallPromptEvent): void {
    this._loggerSvc.info(`EVENT at AppComponent.onBeforeInstallPrompt`, $event);
    this._updateSvc.handleBeforeInstallPrompt($event);
  }

  /**
   * Creates an instance of AppComponent.
   * @param {TranslateService} _translateSvc
   * @param {LoggerService} _loggerSvc
   * @param {ToasterService} _toasterSvc
   * @param {UpdateService} _updateSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {Document} _document
   * @param {ViewportScroller} _viewportScroller
   * @param {Title} _title
   * @param {Meta} _meta
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AppComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    private _loggerSvc: LoggerService,
    private _toasterSvc: ToasterService,
    private _updateSvc: UpdateService,
    private _googleLoginSvc: GoogleLoginService,
    private _facebookLoginSvc: FacebookLoginService,
    private _lineLoginSvc: LineLoginService,

    protected _router: Router,
    private _route: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
    private _viewportScroller: ViewportScroller,
    private _title: Title,
    private _meta: Meta,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof AppComponent
   */
  public ngOnInit() {
    this._loggerSvc.info(environment);
    this.setBaseHref();
    this.initScroll();
    this.subscribeEvents();

    this._lineLoginSvc
      .signIn$()
      .pipe()
      .subscribe((s) => {
        console.log(s);
      });
  }

  /**
   *
   *
   * @memberof AppComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {string} [key='name']
   * @param {string} [value='description']
   * @returns {string}
   * @memberof AppComponent
   */
  public getMetaTag(key: string = 'name', value: string = 'description') {
    return this._meta.getTag(`${key}=${value}`);
  }

  /**
   *
   *
   * @param {*} props
   * @memberof AppComponent
   */
  public setMetaTag(props: any): void {
    this._meta.addTag(props);
  }

  /**
   *
   *
   * @private
   * @memberof AppComponent
   */
  private setBaseHref(): void {
    const [$base]: Element[] = Array.from(
      this._document.getElementsByTagName('base')
    );
    if ($base) {
      $base.setAttribute('href', environment.base_href);
    }
  }

  /**
   *
   *
   * @private
   * @memberof AppComponent
   */
  protected initScroll(): void {
    this._viewportScroller.scrollToPosition([0, 0]);
  }

  /**
   *
   *
   * @protected
   * @memberof AppComponent
   */
  protected subscribeEvents(): void {
    // show toaster
    this._subscription.add(
      this._route.queryParams
        .pipe(
          distinctUntilChanged(),
          map((params: RouteParams) => params as IToastParam),
          filter((params: IToastParam) => this._isValidToastParam(params)),
          tap((params: IToastParam) => this._toasterSvc.show(params)),
          concatMap(() => this.navigate$([])) // clear queryParams
        )
        .subscribe()
    );

    const [activation$, navigation$]: Observable<Event$>[] = partition$(
      this._router.events.pipe(
        distinctUntilChanged(),
        filter(($event: Event$) => this._isValidRouterEvent($event)),
        tap(() => this._changeDetectorRef.markForCheck())
      ),
      ($event: Event$) => this._isActivationEvent($event)
    );

    // ページ遷移前のルーターイベントからデータを取得してタイトル情報をセットする。
    this._subscription.add(
      activation$
        .pipe(
          map(($event: Event$) => _.get($event, 'snapshot.data')),
          filter(this._isValidLayoutData.bind(this)),
          tap(($data: ILayoutData) => (this.layout = $data)),
          map(($data: ILayoutData) => _.get($data, 'title')),
          filter((title: string) => !_.isEmpty(title)),
          concatMap((title: string) => this.translate$(title))
        )
        .subscribe((title: string) => (this.title = title))
    );

    const duration: number = 100;
    // ページ遷移に対してloadingを表示する
    this._subscription.add(
      navigation$
        .pipe(
          map(($event: Event$) => $event instanceof NavigationStart),
          delay(duration)
        )
        .subscribe((value: boolean) => (this.isBusy = value))
    );
  }

  /**
   *
   *
   * @private
   * @param {Event$} $event
   * @return {boolean}
   * @memberof AppComponent
   */
  private _isValidRouterEvent($event: Event$): boolean {
    return this._isNavigationEvent($event) || this._isActivationEvent($event);
  }

  /**
   *
   *
   * @private
   * @param {Event$} $event
   * @return {boolean}
   * @memberof AppComponent
   */
  private _isActivationEvent($event: Event$): boolean {
    return $event instanceof ActivationEnd;
  }

  /**
   *
   *
   * @private
   * @param {Event$} $event
   * @return {boolean}
   * @memberof AppComponent
   */
  private _isNavigationEvent($event: Event$): boolean {
    return (
      $event instanceof NavigationStart ||
      $event instanceof NavigationEnd ||
      $event instanceof NavigationCancel ||
      $event instanceof NavigationError
    );
  }

  /**
   *
   *
   * @private
   * @param {IToastParam} params
   * @returns {boolean}
   * @memberof AppComponent
   */
  private _isValidToastParam(params: IToastParam): boolean {
    return _.has(params, 'type') && _.has(params, 'message');
  }

  /**
   *
   *
   * @private
   * @param {ILayoutData} $data
   * @returns {boolean}
   * @memberof AppComponent
   */
  private _isValidLayoutData($data: ILayoutData): boolean {
    return (
      _.has($data, 'title') &&
      _.has($data, 'header') &&
      _.has($data, 'footer') &&
      _.has($data, 'showHeaderSpan') &&
      _.has($data, 'headerStyle') &&
      _.has($data, 'wrapperClass')
    );
  }
}
