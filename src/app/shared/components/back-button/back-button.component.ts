import {
  Input,
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute, Params as RouteParams } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '@core/class/util';
import { Observable, BehaviorSubject, Subscription, of as of$ } from 'rxjs';
import { map, filter, tap, take, distinctUntilChanged } from 'rxjs/operators';
import { IBackButtonOptions } from '@shared/interfaces';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class BackButtonComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButtonComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @protected
   * @type {BehaviorSubject<string>}
   * @memberof BackButtonComponent
   */
  protected _urlSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  /**
   *
   *
   * @type {Observable<string>}
   * @memberof BackButtonComponent
   */
  public url$: Observable<string> = this._urlSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {boolean}
   * @memberof BackButtonComponent
   */
  public get url(): string {
    return this._urlSubject.getValue();
  }

  /**
   *
   *
   * @param {string} url
   * @returns {void}
   * @memberof BackButtonComponent
   */
  public set url(url: string) {
    this._urlSubject.next(url);
  }

  /**
   *
   *
   * @protected
   * @type {IBackButtonOptions}
   * @memberof BackButtonComponent
   */
  protected _options: IBackButtonOptions = {
    clazz: 'btn-sm',
    type: 'button',
    position: 'bottom-right',
  };

  /**
   *
   *
   * @type {IBackButtonOptions}
   * @memberof BackButtonComponent
   */
  public get options(): IBackButtonOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof BackButtonComponent
   */
  @Input()
  public set options(options: IBackButtonOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BackButtonComponent
   */
  public get canBack(): boolean {
    return !_.isEmpty(this.url);
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BackButtonComponent
   */
  public get hasHistory(): boolean {
    const state: unknown = this._location.getState();
    const navigationId: number = _.get(state, 'navigationId', -1);
    return navigationId > 1;
  }

  /**
   * Creates an instance of BackButtonComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BackButtonComponent
   */
  public constructor(
    private _location: Location,
    private _route: ActivatedRoute,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof BackButtonComponent
   */
  public ngOnInit() {
    super.ngOnInit();
    this._subscription.add(
      this._route.queryParams
        .pipe(
          distinctUntilChanged(),
          filter((params: RouteParams) => _.has(params, 'backUrl')),
          map((params: RouteParams) => _.get(params, 'backUrl')),
          tap((url: string) => (this.url = url))
        )
        .subscribe()
    );
  }

  /**
   *
   *
   * @memberof BackButtonComponent
   */
  public ngOnDestroy() {
    this._urlSubject.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof BackButtonComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @memberof BackButtonComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @return {Subscription}
   * @memberof BackButtonComponent
   */
  public backToUrl(): Subscription {
    return this._subscription.add(
      this.navigate$([this.url]).pipe(take(1)).subscribe()
    );
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof BackButtonComponent
   */
  public backToList(): Subscription {
    return this._subscription.add(
      this.navigate$([`/${this.pageName}/`]).subscribe()
    );
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof BackButtonComponent
   */
  public locationBack(): Subscription {
    return this._subscription.add(
      of$(true)
        .pipe(take(1))
        .subscribe(() => this._location.back())
    );
  }

  /**
   *
   *
   * @return {string}
   * @memberof BackButtonComponent
   */
  public get text(): string {
    const to: string = this.getPageText();
    return this.translate('common.backTo', { to });
  }
}
