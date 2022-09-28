import { distinctUntilChanged } from 'rxjs/operators';
import {
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';
import { NetworkService } from '@shared/services';

@Component({
  selector: 'admin-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof OfflineComponent
   */
  private _isOnline: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof OfflineComponent
   */
  public get isOnline(): boolean {
    return this._isOnline;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof OfflineComponent
   */
  public set isOnline(isOnline: boolean) {
    this._isOnline = isOnline;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of OfflineComponent.
   * @param {NetworkService} _networkSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof OfflineComponent
   */
  public constructor(
    private _networkSvc: NetworkService,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof OfflineComponent
   */
  public ngOnInit() {
    super.ngOnInit();
    this._subscription.add(
      this._networkSvc.status$
        .pipe(distinctUntilChanged())
        .subscribe((status: boolean) => (this.isOnline = status))
    );
  }

  /**
   *
   *
   * @memberof OfflineComponent
   */
  public reload(): void {
    return document.location.reload();
  }
}
