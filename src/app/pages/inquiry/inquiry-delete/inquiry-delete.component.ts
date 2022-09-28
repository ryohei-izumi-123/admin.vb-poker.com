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
import { IInquiry } from '@shared/interfaces';
import { InquiryService, ToasterService } from '@shared/services';
import { BaseDeleteComponent } from '@core/class/base-delete.component';

/**
 *
 *
 * @export
 * @class InquiryDeleteComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-inquiry-delete',
  templateUrl: './inquiry-delete.component.html',
  styleUrls: ['./inquiry-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InquiryDeleteComponent
  extends BaseDeleteComponent<IInquiry, InquiryService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of InquiryDeleteComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {InquiryService} _inquirySvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof InquiryDeleteComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _inquirySvc: InquiryService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _inquirySvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof InquiryDeleteComponent
   */
  public initForm(): void {
    this.form = new FormGroup({});
  }
}
