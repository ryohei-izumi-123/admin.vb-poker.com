import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { IWebpage } from '@shared/interfaces';
import { CsvService, WebpageService } from '@shared/services';
import { WebpageStatusComponent } from '@pages/webpage/webpage-status/webpage-status.component';
import { BaseListComponent } from '@core/class/base-list.component';

/**
 *
 *
 * @export
 * @class WebpageListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-webpage-list',
  templateUrl: './webpage-list.component.html',
  styleUrls: ['./webpage-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebpageListComponent
  extends BaseListComponent<IWebpage, WebpageService, WebpageStatusComponent>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of WebpageListComponent.
   * @param {TranslateService} _translateSvc
   * @param {WebpageService} _webpageSvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof WebpageListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _webpageSvc: WebpageService,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _webpageSvc, _csvSvc, _router, _changeDetectorRef);
  }

  /**
   *
   * @returns {IWebpage[]}
   * @memberof WebpageListComponent
   */
  public exportAsCsv(): IWebpage[] {
    const filename: string = `download-${this.pageName}`;
    const data: IWebpage[] = _.cloneDeep(this.rows).map((row: IWebpage) => {
      return {
        id: row.id,
        pageType: row.pageType,
        locale: row.locale,
        status: row.status,
      };
    });

    return this._csvSvc.generate<IWebpage>(data, filename);
  }
}
