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
import { IInquiry } from '@shared/interfaces';
import { CsvService, InquiryService } from '@shared/services';
import { InquiryStatusComponent } from '@pages/inquiry/inquiry-status/inquiry-status.component';
import { BaseListComponent } from '@core/class/base-list.component';

/**
 *
 *
 * @export
 * @class InquiryListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-inquiry-list',
  templateUrl: './inquiry-list.component.html',
  styleUrls: ['./inquiry-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InquiryListComponent
  extends BaseListComponent<IInquiry, InquiryService, InquiryStatusComponent>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of InquiryListComponent.
   * @param {TranslateService} _translateSvc
   * @param {InquiryService} _inquirySvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof InquiryListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _inquirySvc: InquiryService,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _inquirySvc, _csvSvc, _router, _changeDetectorRef);
  }

  /**
   *
   * @returns {IInquiry[]}
   * @memberof InquiryListComponent
   */
  public exportAsCsv(): IInquiry[] {
    const filename: string = `download-${this.pageName}`;
    const data: IInquiry[] = _.cloneDeep(this.rows).map((row: IInquiry) => {
      return {
        id: row.id,
        name: row.name,
        categoryName: row.category.name,
        price: row.price,
        remarks: row.remarks,
        status: row.status,
      };
    });

    return this._csvSvc.generate<IInquiry>(data, filename);
  }
}
