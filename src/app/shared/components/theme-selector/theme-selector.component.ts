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
import { ThemeService } from '@shared/services/theme.service';
import { TTheme } from '@shared/types/theme';

/**
 *
 *
 * @export
 * @class ThemeSelectorComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-theme-selector',
  templateUrl: './theme-selector.component.html',
  styleUrls: ['./theme-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectorComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @type {TTheme}
   * @memberof ThemeSelectorComponent
   */
  public get label(): TTheme {
    return this._themeSvc.convertBoolToTheme(this.value);
  }

  /**
   *
   *
   * @type {string}
   * @memberof ThemeSelectorComponent
   */
  public get icon(): string {
    return this._themeSvc.convertBoolToIcon(this.value);
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof ThemeSelectorComponent
   */
  public value: boolean = false;

  /**
   *
   *
   * @type {TTheme[]}
   * @memberof ThemeSelectorComponent
   */
  public themes: TTheme[] = this._themeSvc.themes;

  /**
   * Creates an instance of ThemeSelectorComponent.
   * @param {ThemeService} _themeSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ThemeSelectorComponent
   */
  public constructor(
    private _themeSvc: ThemeService,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof ThemeSelectorComponent
   */
  public ngOnInit(): void {
    super.ngOnInit();
    this.value = this._themeSvc.convertThemeToBool(this._themeSvc.theme);
  }

  /**
   *
   *
   * @param {TTheme} theme
   * @return {boolean}
   * @memberof ThemeSelectorComponent
   */
  public setTheme(theme: TTheme): void {
    if (theme !== this._themeSvc.theme) {
      this._themeSvc.theme = theme;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   *
   *
   * @param {boolean} $event
   * @memberof ThemeSelectorComponent
   */
  public onChange($event: boolean) {
    this.setTheme(this._themeSvc.convertBoolToTheme($event));
  }
}
