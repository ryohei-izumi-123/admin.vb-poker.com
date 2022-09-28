import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';
import { LocaleService } from '@shared/services/locale.service';
import { TIso6391 } from '@shared/types/iso639-1';

/**
 *
 *
 * @export
 * @class LocaleSelectorComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-locale-selector',
  templateUrl: './locale-selector.component.html',
  styleUrls: ['./locale-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocaleSelectorComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @type {TIso6391}
   * @memberof LocaleSelectorComponent
   */
  public current: TIso6391 = this._localeSvc.locale;

  /**
   *
   *
   * @type {TIso6391[]}
   * @memberof LocaleSelectorComponent
   */
  public locales: TIso6391[] = this._localeSvc.locales;

  /**
   * Creates an instance of LocaleSelectorComponent.
   * @param {LocaleService} _localeSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LocaleSelectorComponent
   */
  public constructor(
    private _localeSvc: LocaleService,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @param {TIso6391} locale
   * @return {boolean}
   * @memberof LocaleSelectorComponent
   */
  public setLocale(locale: TIso6391): void {
    if (locale !== this.current) {
      this._localeSvc.locale = locale;
      this._changeDetectorRef.markForCheck();
      document.location.reload();
    }
  }
}
