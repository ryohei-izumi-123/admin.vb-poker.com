import { Directive, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 *
 *
 * @export
 * @class BaseDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[ngBase]',
})
export abstract class BaseDirective implements OnInit, OnDestroy {
  /**
   *
   *
   * @protected
   * @type {Subscription}
   * @memberof BaseDirective
   */
  protected _subscription: Subscription = new Subscription();

  /**
   * Creates an instance of BaseDirective.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseDirective
   */
  public constructor(protected _changeDetectorRef: ChangeDetectorRef) {}

  /**
   *
   *
   * @memberof BaseDirective
   */
  public ngOnInit() {}

  /**
   * @see 絶対に`this._changeDetectorRef.detach();`やってはいけない。そもそもDirectiveにはアタッチされていないのでホストされているコンポーネント等のChangeDetectorRefがデタッチされてしまい、とんでもない挙動になる。
   * @description
   * @memberof BaseDirective
   */
  public ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
