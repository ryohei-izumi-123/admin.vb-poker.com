import {
  Component,
  OnInit,
  OnDestroy,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { ITooltipIconOptions } from '@shared/interfaces';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class TooltipIconComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-tooltip-icon',
  templateUrl: './tooltip-icon.component.html',
  styleUrls: ['./tooltip-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipIconComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof TooltipIconComponent
   */
  @Output()
  public click$: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @protected
   * @type {ITooltipIconOptions}
   * @memberof TooltipIconComponent
   */
  protected _options: ITooltipIconOptions = {
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
   * @type {ITooltipIconOptions}
   * @memberof TooltipIconComponent
   */
  public get options(): ITooltipIconOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof TooltipIconComponent
   */
  @Input()
  public set options(options: ITooltipIconOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of HomeComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof TooltipIconComponent
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
   * @memberof TooltipIconComponent
   */
  public ngOnDestroy() {
    this.click$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof TooltipIconComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {MouseEvent} $event
   * @returns {void}
   * @memberof TooltipIconComponent
   */
  public onClick($event: MouseEvent): void {
    this.click$.emit($event);
  }
}
