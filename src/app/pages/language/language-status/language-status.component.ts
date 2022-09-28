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
import { ILanguage } from '@shared/interfaces';
import { LanguageService, ToasterService } from '@shared/services';
import { BaseStatusComponent } from '@core/class/base-status.component';
/**
 *
 *
 * @export
 * @class LanguageStatusComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-language-status',
  templateUrl: './language-status.component.html',
  styleUrls: ['./language-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageStatusComponent
  extends BaseStatusComponent<ILanguage, LanguageService>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Creates an instance of LanguageStatusComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {LanguageService} _languageSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LanguageStatusComponent
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
   * @memberof LanguageStatusComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      scope: new FormControl(
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
