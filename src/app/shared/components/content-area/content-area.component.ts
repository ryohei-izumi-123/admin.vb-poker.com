import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class ContentAreaComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-content-area',
  templateUrl: './content-area.component.html',
  styleUrls: ['./content-area.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentAreaComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @param {MouseEvent} $event
   * @memberof ContentAreaComponent
   */
  @HostListener('window:scroll', ['$event'])
  public onWindowScroll($event: UIEvent) {}

  /**
   * Creates an instance of ContentAreaComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ContentAreaComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }
}
