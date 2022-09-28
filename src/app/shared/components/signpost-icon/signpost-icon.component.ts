import {
  Input,
  Output,
  EventEmitter,
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ISignpostIconOptions } from '@shared/interfaces';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class SignpostIconComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-signpost-icon',
  templateUrl: './signpost-icon.component.html',
  styleUrls: ['./signpost-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignpostIconComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof SignpostIconComponent
   */
  @Output()
  public click$: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @protected
   * @type {ISignpostIconOptions}
   * @memberof SignpostIconComponent
   */
  protected _options: ISignpostIconOptions = {
    icon: {
      size: 16,
      shape: 'exclamation-circle',
    },
    clazz: '',
    position: 'top-left',
  };

  /**
   *
   *
   * @type {ISignpostIconOptions}
   * @memberof SignpostIconComponent
   */
  public get options(): ISignpostIconOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof SignpostIconComponent
   */
  @Input()
  public set options(options: ISignpostIconOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of SignpostIconComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof SignpostIconComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof SignpostIconComponent
   */
  public ngOnDestroy() {
    this.click$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {MouseEvent} $event
   * @returns {void}
   * @memberof SignpostIconComponent
   */
  public onClick($event: MouseEvent): void {
    this.click$.emit($event);
  }
}
