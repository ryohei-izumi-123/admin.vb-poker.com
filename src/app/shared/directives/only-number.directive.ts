import {
  Directive,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
} from '@angular/core';
import { _ } from '@core/class/util';
import { BaseDirective } from '@core/class/base.directive';
import { Debounce } from '@core/decorators/debounce.decorator';

/**
 *
 *
 * @export
 * @description `数字しかタイプできない入力要素
 * @example `<input ngOnlyNumber />`
 * @class OnlyNumberDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: 'input[ngOnlyNumber]',
})
export class OnlyNumberDirective
  extends BaseDirective
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @readonly
   * @private
   * @type {HTMLInputElement}
   * @memberof OnlyNumberDirective
   */
  private get $input(): HTMLInputElement {
    return _.get(this._elementRef, 'nativeElement') as HTMLInputElement;
  }

  /**
   * Creates an instance of OnlyNumberDirective.
   * @param {ElementRef<HTMLInputElement>} _elementRef
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof OnlyNumberDirective
   */
  public constructor(
    private _elementRef: ElementRef<HTMLInputElement>,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_changeDetectorRef);
  }

  /**
   *
   *
   * @memberof OnlyNumberDirective
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {KeyboardEvent} $event
   * @memberof OnlyNumberDirective
   */
  @HostListener('keypress', ['$event'])
  public onKeyPress($event: KeyboardEvent) {
    const valid: boolean = '0123456789'.includes($event.key);
    if (!valid) {
      $event.preventDefault();
    }
  }

  /**
   *
   *
   * @return {void}
   * @memberof OnlyNumberDirective
   */
  @Debounce(100)
  @HostListener('blur')
  public onBlur(): void {
    if (!this.$input) {
      return;
    }

    const value: string = this.$input.value;
    if (_.isNull(value) || _.isUndefined(value) || _.size(value) === 0) {
      return;
    }

    const regex: RegExp = new RegExp(/[^0-9]/g);
    if (regex.test(value)) {
      this.$input.value = value.replace(regex, '');
      this._changeDetectorRef.detectChanges();
    }
  }
}
