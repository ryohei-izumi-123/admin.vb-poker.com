import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IWebpage } from '@shared/interfaces';
import { WebpageService, ToasterService } from '@shared/services';
import { BaseStatusComponent } from '@core/class/base-status.component';
/**
 *
 *
 * @export
 * @class WebpageStatusComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-webpage-status',
  templateUrl: './webpage-status.component.html',
  styleUrls: ['./webpage-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebpageStatusComponent
  extends BaseStatusComponent<IWebpage, WebpageService>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Creates an instance of WebpageStatusComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {WebpageService} _webpageSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof WebpageStatusComponent
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
   * @memberof WebpageStatusComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      pageType: new FormControl(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      locale: new FormControl(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      status: new FormControl(null, Validators.compose([Validators.required])),
    });
  }
}
