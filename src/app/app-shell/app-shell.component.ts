import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';

/**
 *
 *
 * @export
 * @class AppShellComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent implements OnInit, OnDestroy {
  /**
   *
   *
   * @private
   * @type {Subscription}
   * @memberof AppShellComponent
   */
  private _subscription: Subscription = new Subscription();

  /**
   *Creates an instance of AppShellComponent.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AppShellComponent
   */
  public constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  /**
   *
   *
   * @memberof AppShellComponent
   */
  public ngOnInit() {}

  /**
   *
   *
   * @memberof AppShellComponent
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
    this._changeDetectorRef.detach();
  }
}
