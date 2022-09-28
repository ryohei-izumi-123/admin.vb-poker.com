import { environment } from '@env/environment';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injectable,
  Injector,
  Input,
  NgZone,
  OnInit,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  Validators,
  AsyncValidatorFn,
} from '@angular/forms';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICaptchaConfig } from '@shared/interfaces';
import { ICaptchaResponse } from '@shared/interfaces';
import { RECAPTCHA_URL } from '@shared/tokens';
import { BaseDirective } from '@core/class/base.directive';

/**
 *
 *
 * @class RecaptchaAsyncValidator
 */
@Injectable()
export class RecaptchaAsyncValidator {
  /**
   *Creates an instance of RecaptchaAsyncValidator.
   * @param {HttpClient} _http
   * @param {string} _url
   * @memberof RecaptchaAsyncValidator
   */
  public constructor(
    private _http: HttpClient,
    @Inject(RECAPTCHA_URL) private _url: string
  ) {}

  /**
   *
   *
   * @param {string} token
   * @returns {AsyncValidatorFn}
   * @memberof RecaptchaAsyncValidator
   */
  public validateToken(token: string): AsyncValidatorFn {
    return (ctrl: AbstractControl) => {
      return this._http
        .get<ICaptchaResponse>(this._url, {
          headers: new HttpHeaders({ Accept: 'application/json' }),
          observe: 'body',
          params: { token },
          responseType: 'json',
          withCredentials: false,
          reportProgress: false,
        })
        .pipe(
          map((response: ICaptchaResponse) => {
            if (!response.success) {
              return { tokenInvalid: true };
            }

            return null;
          })
        );
    };
  }
}

/**
 *
 *
 * @export
 * @class RecaptchaDirective
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {ControlValueAccessor}
 */
@Directive({
  selector: '[recaptcha]',
  exportAs: 'recaptcha',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecaptchaDirective),
      multi: true,
    },
    RecaptchaAsyncValidator,
  ],
})
export class RecaptchaDirective
  extends BaseDirective
  implements OnInit, AfterViewInit, ControlValueAccessor {
  /**
   *
   *
   * @type {string}
   * @memberof RecaptchaDirective
   */
  @Input()
  public _key: string;

  /**
   *
   *
   * @type {ICaptchaConfig}
   * @memberof RecaptchaDirective
   */
  @Input()
  public _config: ICaptchaConfig = {};

  /**
   *
   *
   * @type {string}
   * @memberof RecaptchaDirective
   */
  @Input()
  public _lang: string;

  /**
   *
   *
   * @memberof RecaptchaDirective
   */
  @Output()
  public captchaResponse$ = new EventEmitter<string>();

  /**
   *
   *
   * @memberof RecaptchaDirective
   */
  @Output()
  public captchaExpired$ = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {AbstractControl}
   * @memberof RecaptchaDirective
   */
  private _ctrl: AbstractControl;

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof RecaptchaDirective
   */
  private _widgetId: number;

  /**
   *
   *
   * @private
   * @memberof RecaptchaDirective
   */
  private onChange: (value: string) => void;

  /**
   *
   *
   * @private
   * @memberof RecaptchaDirective
   */
  private onTouched: (value: string) => void;

  /**
   * Creates an instance of RecaptchaDirective.
   * @param {ElementRef} _elementRef
   * @param {NgZone} _ngZone
   * @param {Injector} _injector
   * @param {RecaptchaAsyncValidator} _reCaptchaAsyncValidator
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof RecaptchaDirective
   */
  public constructor(
    private _elementRef: ElementRef,
    private _ngZone: NgZone,
    private _injector: Injector,
    private _reCaptchaAsyncValidator: RecaptchaAsyncValidator,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_changeDetectorRef);
  }

  /**
   *
   *
   * @memberof RecaptchaDirective
   */
  public ngOnInit() {
    this.registerRecaptchaCallback();
    this.load();
  }

  /**
   *
   *
   * @memberof RecaptchaDirective
   */
  public registerRecaptchaCallback(): void {
    window.reCaptchaLoad = () => {
      const config: ICaptchaConfig = {
        ...this._config,
        sitekey: this._key,
        callback: this.onSuccess.bind(this),
        'expired-callback': this.onExpired.bind(this),
      };
      this._widgetId = this.render(this._elementRef.nativeElement, config);
    };
  }

  /**
   *
   *
   * @memberof RecaptchaDirective
   */
  public ngAfterViewInit() {
    this._ctrl = this._injector.get<NgControl>(NgControl as any).control;
    this.setValidators();
  }

  /**
   *
   *
   * @returns {number}
   * @memberof RecaptchaDirective
   */
  getId(): number {
    return this._widgetId;
  }

  /**
   *
   *
   * @private
   * @memberof RecaptchaDirective
   */
  private setValidators(): void {
    this._ctrl.setValidators(Validators.required);
    this._ctrl.updateValueAndValidity();
  }

  /**
   *
   *
   * @param {*} value
   * @memberof RecaptchaDirective
   */
  public writeValue(value: any): void {}

  /**
   *
   *
   * @param {*} fn
   * @memberof RecaptchaDirective
   */
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   *
   *
   * @param {*} fn
   * @memberof RecaptchaDirective
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   *
   *
   * @memberof RecaptchaDirective
   */
  public onExpired(): void {
    this._ngZone.run(() => {
      this.captchaExpired$.emit();
      this.onChange(null);
      this.onTouched(null);
    });
  }

  /**
   *
   *
   * @param {string} token
   * @memberof RecaptchaDirective
   */
  public onSuccess(token: string): void {
    this._ngZone.run(() => {
      this.validateToken(token);
      this.captchaResponse$.next(token);
      this.onChange(token);
      this.onTouched(token);
    });
  }

  /**
   *
   *
   * @param {string} token
   * @memberof RecaptchaDirective
   */
  public validateToken(token: string): void {
    this._ctrl.setAsyncValidators(
      this._reCaptchaAsyncValidator.validateToken(token)
    );
    this._ctrl.updateValueAndValidity();
  }

  /**
   *
   *
   * @private
   * @param {HTMLElement} $element
   * @param {ICaptchaConfig} config
   * @returns {number}
   * @memberof RecaptchaDirective
   */
  private render($element: HTMLElement, config: ICaptchaConfig): number {
    return window.grecaptcha.render($element, config);
  }

  /**
   *
   *
   * @returns {void}
   * @memberof RecaptchaDirective
   */
  public reset(): void {
    if (!this._widgetId) {
      return;
    }
    window.grecaptcha.reset(this._widgetId);
    this.onChange(null);
  }

  /**
   *
   *
   * @returns {string}
   * @memberof RecaptchaDirective
   */
  public getResponse(): string {
    if (!this._widgetId) {
      return window.grecaptcha.getResponse(this._widgetId);
    }

    return '';
  }

  /**
   *
   *
   * @memberof RecaptchaDirective
   */
  public load(): void {
    const script: HTMLScriptElement = document.createElement('script');
    const lang: string = this._lang ? '&hl=' + this._lang : '';
    script.src = `${environment.google.recaptcha.script}${lang}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
}
