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
import { IInquiry } from '@shared/interfaces';
import { InquiryService, ToasterService } from '@shared/services';
import { BaseStatusComponent } from '@core/class/base-status.component';
/**
 *
 *
 * @export
 * @class InquiryStatusComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-inquiry-status',
  templateUrl: './inquiry-status.component.html',
  styleUrls: ['./inquiry-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InquiryStatusComponent
  extends BaseStatusComponent<IInquiry, InquiryService>
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   * Creates an instance of InquiryStatusComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {InquiryService} _inquirySvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof InquiryStatusComponent
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
   * @memberof InquiryStatusComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(16),
        ])
      ),
      status: new FormControl(null, Validators.compose([Validators.required])),
    });
  }
}
