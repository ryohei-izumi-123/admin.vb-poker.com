import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IWebpage } from '@shared/interfaces';
import { WebpageService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class WebpageDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-webpage-detail',
  templateUrl: './webpage-detail.component.html',
  styleUrls: ['./webpage-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebpageDetailComponent
  extends BaseDetailComponent<IWebpage, WebpageService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of WebpageDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {WebpageService} _webpageSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof WebpageDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _webpageSvc: WebpageService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _webpageSvc, _router, _route, _changeDetectorRef);
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof WebpageDetailComponent
   */
  private _viewSource: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof WebpageDetailComponent
   */
  public get viewSource(): boolean {
    return this._viewSource;
  }

  /**
   *
   *
   * @memberof WebpageDetailComponent
   */
  public set viewSource(viewSource: boolean) {
    this._viewSource = viewSource;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @memberof WebpageDetailComponent
   */
  public toggle(): void {
    this.viewSource = !this.viewSource;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof WebpageDetailComponent
   */
  public get icon(): string {
    return this.viewSource ? 'text' : 'code';
  }
}
