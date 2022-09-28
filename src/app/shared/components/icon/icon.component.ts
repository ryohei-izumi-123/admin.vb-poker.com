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
  OnChanges,
} from '@angular/core';
import { IIconOptions } from '@shared/interfaces';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class IconComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof IconComponent
   */
  @Output()
  public click$: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @protected
   * @type {IIconOptions}
   * @memberof IconComponent
   */
  protected _options: IIconOptions = {
    size: 16,
    shape: 'exclamation-circle',
  };

  /**
   *
   *
   * @type {IIconOptions}
   * @memberof IconComponent
   */
  public get options(): IIconOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof IconComponent
   */
  @Input()
  public set options(options: IIconOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of IconComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof IconComponent
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
   * @memberof IconComponent
   */
  public ngOnDestroy() {
    this.click$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof IconComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @param {MouseEvent} $event
   * @returns {void}
   * @memberof IconComponent
   */
  public onClick($event: MouseEvent): void {
    this.click$.emit($event);
  }
}
