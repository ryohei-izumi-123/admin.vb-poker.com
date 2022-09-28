import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IWebpage } from '@shared/interfaces';
import { WebpageService, ToasterService } from '@shared/services';
import { BaseDeleteComponent } from '@core/class/base-delete.component';

/**
 *
 *
 * @export
 * @class WebpageDeleteComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-webpage-delete',
  templateUrl: './webpage-delete.component.html',
  styleUrls: ['./webpage-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebpageDeleteComponent
  extends BaseDeleteComponent<IWebpage, WebpageService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of WebpageDeleteComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {WebpageService} _webpageSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof WebpageDeleteComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _webpageSvc: WebpageService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _webpageSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof WebpageDeleteComponent
   */
  public initForm(): void {
    this.form = new FormGroup({});
  }
}
