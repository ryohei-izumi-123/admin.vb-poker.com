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
import { ILanguage } from '@shared/interfaces';
import { LanguageService, ToasterService } from '@shared/services';
import { BaseDeleteComponent } from '@core/class/base-delete.component';

/**
 *
 *
 * @export
 * @class LanguageDeleteComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-language-delete',
  templateUrl: './language-delete.component.html',
  styleUrls: ['./language-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageDeleteComponent
  extends BaseDeleteComponent<ILanguage, LanguageService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of LanguageDeleteComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {LanguageService} _languageSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LanguageDeleteComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _languageSvc: LanguageService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _languageSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof LanguageDeleteComponent
   */
  public initForm(): void {
    this.form = new FormGroup({});
  }
}
