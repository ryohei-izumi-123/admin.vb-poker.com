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
import { IInquiry } from '@shared/interfaces';
import { InquiryService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class InquiryDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-inquiry-detail',
  templateUrl: './inquiry-detail.component.html',
  styleUrls: ['./inquiry-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InquiryDetailComponent
  extends BaseDetailComponent<IInquiry, InquiryService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of InquiryDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {InquiryService} _inquirySvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof InquiryDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _inquirySvc: InquiryService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _inquirySvc, _router, _route, _changeDetectorRef);
  }
}
