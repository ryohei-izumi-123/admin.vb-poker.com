import { environment } from '@env/environment';
import {
  ViewChild,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Observable,
  BehaviorSubject,
  Subscription,
  EMPTY as EMPTY$,
  interval as interval$,
} from 'rxjs';
import { distinctUntilChanged, skipWhile, take, tap } from 'rxjs/operators';
import { InvisibleReCaptchaComponent } from 'ngx-captcha';
import { TranslateService } from '@ngx-translate/core';
import { BaseFormComponent } from '@core/class/base-form.component';
import { NetworkService } from '@shared/services/network.service';

/**
 *
 * @export
 * @class RecaptchaComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-recaptcha',
  templateUrl: './recaptcha.component.html',
  styleUrls: ['./recaptcha.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecaptchaComponent
  extends BaseFormComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @readonly
   * @type {Observable<boolean>}
   * @memberof RecaptchaComponent
   */
  public get isOnline$(): Observable<boolean> {
    return this._networkSvc.status$.pipe(
      distinctUntilChanged(),
      skipWhile((status: boolean) => !status),
      tap(() => this._changeDetectorRef.markForCheck()),
      take(1)
    );
  }

  /**
   *
   *
   * @type {EventEmitter<string>}
   * @memberof RecaptchaComponent
   */
  @Output()
  public verified$: EventEmitter<string> = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<string>}
   * @memberof RecaptchaComponent
   */
  private _responseSubject: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  /**
   *
   *
   * @type {Observable<string>}
   * @memberof RecaptchaComponent
   */
  public response$: Observable<string> = this._responseSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @public
   * @type {string}
   * @memberof RecaptchaComponent
   */
  public set response(response: string) {
    this._responseSubject.next(response);
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof RecaptchaComponent
   */
  public get response(): string {
    return this._responseSubject.getValue();
  }

  /**
   *
   *
   * @type {string}
   * @memberof RecaptchaComponent
   */
  public get siteKey(): string {
    return this._siteKey;
  }

  /**
   *
   *
   * @type {string}
   * @memberof RecaptchaComponent
   */
  public set siteKey(siteKey: string) {
    this._siteKey = siteKey;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof RecaptchaComponent
   */
  private _siteKey: string = environment.google.recaptcha.siteKey;

  /**
   *
   *
   * @type {number}
   * @memberof RecaptchaComponent
   */
  public get captchaId(): number {
    return this._captchaId;
  }

  /**
   *
   *
   * @type {number}
   * @memberof RecaptchaComponent
   */
  public set captchaId(captchaId: number) {
    this._captchaId = captchaId;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {number}
   * @memberof RecaptchaComponent
   */
  private _captchaId: number;

  /**
   *
   *
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  public get isLoaded(): boolean {
    return this._isLoaded;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  public set isLoaded(isLoaded: boolean) {
    this._isLoaded = isLoaded;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  private _isLoaded: boolean;

  /**
   *
   *
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  public get isSucceed(): boolean {
    return this._isSucceed;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  public set isSucceed(isSucceed: boolean) {
    this._isSucceed = isSucceed;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  private _isSucceed: boolean;

  /**
   *
   *
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  public get isReady(): boolean {
    return this._isReady;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  public set isReady(isReady: boolean) {
    this._isReady = isReady;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  private _isReady: boolean;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof RecaptchaComponent
   */
  public get isValid(): boolean {
    return this.isReady && this.isLoaded && this.isSucceed && this.form.valid;
  }

  /**
   *
   *
   * @type {InvisibleReCaptchaComponent}
   * @memberof RecaptchaComponent
   */
  @ViewChild('$recaptcha')
  public $recaptcha: InvisibleReCaptchaComponent;

  /**
   * Creates an instance of RecaptchaComponent.
   * @param {NetworkService} _networkSvc
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof RecaptchaComponent
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
   * @memberof RecaptchaComponent
   */
  public ngOnInit() {
    this.initForm();
    this._subscription.add(
      interval$(1000 * 60 * 5)
        .pipe()
        .subscribe(() => this.reset())
    );
    this._subscription.add(this.response$.subscribe());
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public ngOnDestroy() {
    this.verified$.complete();
    this._responseSubject.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public ngAfterViewInit(): void {
    this.isLoaded = true;
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public execute(): void {
    if (this.$recaptcha) {
      return this.$recaptcha.execute();
    }
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public handleReset(): void {
    this.isSucceed = false;
    this.response = null;
  }

  /**
   *
   *
   * @param {string} response
   * @memberof RecaptchaComponent
   */
  public handleSuccess(response: string): void {
    this.verified$.emit(response);
    this.isSucceed = true;
    this.response = response;
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public handleLoad(): void {
    this.isLoaded = true;
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public handleReady(): void {
    this.isReady = true;
    this.execute();
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public getResponse(): void {
    if (this.$recaptcha) {
      this.response = this.$recaptcha.getResponse();
    }
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public handleExpire(): void {
    this.response = null;
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public handleError(): void {
    this.response = null;
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public reload(): void {
    if (this.$recaptcha) {
      this.$recaptcha.reloadCaptcha();
    }
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public getCaptchaId(): void {
    if (this.$recaptcha) {
      this.captchaId = this.$recaptcha.getCaptchaId();
    }
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  private getCurrentResponse(): void {
    if (this.$recaptcha) {
      this.response = this.$recaptcha.getCurrentResponse();
    }
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      recaptcha: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  /**
   *
   *
   * @returns {Subscription}
   * @memberof RecaptchaComponent
   */
  public onSubmit(): Subscription {
    return this._subscription.add(EMPTY$.subscribe());
  }

  /**
   *
   *
   * @memberof RecaptchaComponent
   */
  public reset(): void {
    super.reset();
    this.response = null;
    if (this.$recaptcha) {
      this.$recaptcha.resetCaptcha();
    }
  }
}
