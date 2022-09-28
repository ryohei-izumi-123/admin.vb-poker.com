import {
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ICardLayoutOptions } from '@shared/interfaces';
import { BaseComponent } from '@core/class/base.component';

@Component({
  selector: 'admin-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardLayoutComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @private
   * @type {ICardLayoutOptions}
   * @memberof CardLayoutComponent
   */
  private _options: ICardLayoutOptions = {
    hasSignpost: true,
    hasHeader: true,
    hasTitle: true,
    hasText: true,
    hasFooter: true,
    useGrid: true,
  };

  /**
   *
   *
   * @readonly
   * @type {ICardLayoutOptions}
   * @memberof CardLayoutComponent
   */
  public get options(): ICardLayoutOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof CardLayoutComponent
   */
  @Input()
  public set options(options: ICardLayoutOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of CardLayoutComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CardLayoutComponent
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
   * @param {SimpleChanges} changes
   * @memberof CardLayoutComponent
   */
  public ngOnChanges(changes: SimpleChanges): void {}
}
