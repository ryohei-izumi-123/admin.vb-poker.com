import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { _, Util } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { ILanguage } from '@shared/interfaces';
import { CsvService, LanguageService } from '@shared/services';
import { LanguageStatusComponent } from '@pages/language/language-status/language-status.component';
import { BaseListComponent } from '@core/class/base-list.component';

/**
 *
 *
 * @export
 * @class LanguageListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageListComponent
  extends BaseListComponent<ILanguage, LanguageService, LanguageStatusComponent>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of LanguageListComponent.
   * @param {TranslateService} _translateSvc
   * @param {LanguageService} _languageSvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LanguageListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _languageSvc: LanguageService,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _languageSvc, _csvSvc, _router, _changeDetectorRef);
  }

  /**
   *
   * @returns {ILanguage[]}
   * @memberof LanguageListComponent
   */
  public exportAsCsv(): ILanguage[] {
    const filename: string = `download-${this.pageName}`;
    const data: ILanguage[] = _.cloneDeep(this.rows).map((row: ILanguage) => {
      return {
        id: row.id,
        locale: row.locale,
        scope: row.scope,
        i18N: Util.toJson(row.i18N, null, 0),
        status: row.status,
      };
    });

    return this._csvSvc.generate<ILanguage>(data, filename);
  }
}
