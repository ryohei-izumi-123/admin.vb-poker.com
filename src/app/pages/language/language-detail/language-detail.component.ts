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
import { ILanguage } from '@shared/interfaces';
import { LanguageService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class LanguageDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-language-detail',
  templateUrl: './language-detail.component.html',
  styleUrls: ['./language-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageDetailComponent
  extends BaseDetailComponent<ILanguage, LanguageService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of LanguageDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {LanguageService} _languageSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LanguageDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _languageSvc: LanguageService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _languageSvc, _router, _route, _changeDetectorRef);
  }
}
