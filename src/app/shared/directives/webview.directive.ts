import { Directive, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BaseDirective } from '@core/class/base.directive';

/**
 *
 *
 * @export
 * @class WebviewDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: 'webview',
})
export class WebviewDirective
  extends BaseDirective
  implements OnInit, OnDestroy {
  /**
   * Creates an instance of WebviewDirective.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof WebviewDirective
   */
  public constructor(protected _changeDetectorRef: ChangeDetectorRef) {
    super(_changeDetectorRef);
  }
}
