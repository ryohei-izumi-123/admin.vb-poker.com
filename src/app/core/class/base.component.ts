import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  Observable,
  Subscription,
  of as of$,
  from as fromPromise$,
} from 'rxjs';
import { catchError, take, delay } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';

/**
 *
 *
 * @export
 * @class BaseComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @protected
   * @type {boolean}
   * @memberof BaseComponent
   */
  protected _isBusy: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseComponent
   */
  public get isBusy(): boolean {
    return this._isBusy;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseComponent
   */
  public set isBusy(isBusy: boolean) {
    this._isBusy = isBusy;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {Subscription}
   * @memberof BaseComponent
   */
  protected _subscription: Subscription = new Subscription();

  /**
   * Creates an instance of BaseComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {}

  /**
   *
   *
   * @memberof BaseComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof BaseComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }

  /**
   *
   *
   * @param {string} key
   * @param {*} [params={}]
   * @returns {Observable<string>}
   * @memberof BaseComponent
   */
  public translate$(key: string, params: any = {}): Observable<string> {
    return this._translateSvc.get(key, params).pipe(take(1));
  }

  /**
   *
   *
   * @param {string} key
   * @param {*} [params={}]
   * @returns {string}
   * @memberof BaseComponent
   */
  public translate(key: string, params: any = {}): string {
    return this._translateSvc.instant(key, params);
  }

  /**
   *
   *
   * @public
   * @param {any[]} commands
   * @param {NavigationExtras} [navigationExtras={}]
   * @param {number} [duration=100]
   * @return {Observable<boolean>}
   * @memberof BaseComponent
   */
  public navigate$(
    commands: any[],
    navigationExtras: NavigationExtras = {},
    duration: number = 100
  ): Observable<boolean> {
    return fromPromise$(this._router.navigate(commands, navigationExtras)).pipe(
      delay(duration),
      catchError(() => of$(false)),
      take(1)
    );
  }

  /**
   *
   * @returns {string}
   * @memberof BaseComponent
   */
  public get pageName(): string {
    const [$segment]: string[] = this.getUrlSegments();
    return $segment;
  }

  /**
   *
   * @protected
   * @returns {string[]}
   * @memberof BaseComponent
   */
  protected getUrlSegments(): string[] {
    const slash: string = '/';
    const url: string = this._router.url;
    const segments: string[] = url.split(slash);

    return segments.filter((segment: string) => !!!_.isEmpty(segment));
  }

  /**
   *
   *
   * @memberof BaseComponent
   */
  public noop(): void {}

  /**
   *
   *
   * @param {string} name
   * @return {() => any}
   * @memberof BaseComponent
   */
  public getCallable(name: string): () => any {
    const callable: () => any = _.get(this, name);
    if (_.isFunction(callable)) {
      return _.bind(callable, this);
    }

    return _.bind(this.noop, this);
  }

  /**
   *
   *
   * @param {string} [type='header']
   * @param {string} [action='index']
   * @param {*} [params={}]
   * @return {string}
   * @memberof BaseComponent
   */
  public getPageText(
    type: string = 'header',
    action: string = 'index',
    params: any = {}
  ): string {
    const resource: string = this.pageName;
    return this.translate(`pages.${resource}.${action}.${type}`, params);
  }

  /**
   *
   *
   * @param {string} url
   * @param {string} [target='_blank']
   * @param {string} [features=undefined]
   * @return {(WindowProxy | null)}
   * @memberof BaseComponent
   */
  public openWindow(
    url: string,
    target: string = '_blank',
    features: string = undefined
  ): WindowProxy | null {
    return window.open(url, target, features);
  }
}
