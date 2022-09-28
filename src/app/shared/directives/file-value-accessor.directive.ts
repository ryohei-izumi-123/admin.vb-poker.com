import {
  HostListener,
  Directive,
  ChangeDetectorRef,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BaseDirective } from '@core/class/base.directive';

/**
 *
 *
 * @export
 * @class FileValueAccessorDirective
 * @implements {ControlValueAccessor}
 */
@Directive({
  selector: 'input[type=file]',
  // host: {
  // '(change)': 'onChange($event.target.files)',
  // '(blur)': 'onTouched()'
  // },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileValueAccessorDirective),
      multi: true,
    },
  ],
})
export class FileValueAccessorDirective
  extends BaseDirective
  implements ControlValueAccessor {
  /**
   * Creates an instance of FileValueAccessorDirective.
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof FileValueAccessorDirective
   */
  public constructor(protected _changeDetectorRef: ChangeDetectorRef) {
    super(_changeDetectorRef);
  }

  /**
   *
   */
  public value: any;

  /**
   *
   *
   * @param {*} value
   * @returns {*}
   * @memberof FileValueAccessorDirective
   */
  public writeValue(value: any): any {}

  /**
   *
   *
   * @memberof FileValueAccessorDirective
   */
  @HostListener('change', ['$event.target.files'])
  public onChange = ($event: Event) => {};

  /**
   *
   *
   * @memberof FileValueAccessorDirective
   */
  @HostListener('blur')
  public onTouched = ($event: Event) => {};

  /**
   *
   *
   * @param {*} callback
   * @returns {*}
   * @memberof FileValueAccessorDirective
   */
  public registerOnChange(callback: any): any {
    this.onChange = callback;
  }

  /**
   *
   *
   * @param {*} callback
   * @returns {*}
   * @memberof FileValueAccessorDirective
   */
  public registerOnTouched(callback: any): any {
    this.onTouched = callback;
  }
}
