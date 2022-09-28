import { environment } from '@env/environment';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class FooterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof FooterComponent
   */
  public get year(): number {
    return new Date().getFullYear();
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof FooterComponent
   */
  public get version(): string {
    return environment.version;
  }

  /**
   *
   *
   * @type {string}
   * @memberof FooterComponent
   */
  public get name(): string {
    return environment.name;
  }

  /**
   * Creates an instance of FooterComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof FooterComponent
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
   * @memberof FooterComponent
   */
  public ngAfterViewInit() {}
}
