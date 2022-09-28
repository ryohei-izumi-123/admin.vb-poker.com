import {
  Input,
  Output,
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { ClrLoadingState } from '@clr/angular';
// import { TButtonType } from '@shared/types';
import { IButtonOptions } from '@shared/interfaces';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class ButtonComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof ButtonComponent
   */
  @Output()
  public click$: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @protected
   * @type {IButtonOptions}
   * @memberof ButtonComponent
   */
  protected _options: IButtonOptions = {
    icon: {
      size: 16,
      shape: 'check',
    },
    clazz: 'btn btn-info btn-sm',
    type: 'button',
  };

  /**
   *
   *
   * @type {IButtonOptions}
   * @memberof ButtonComponent
   */
  public get options(): IButtonOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof ButtonComponent
   */
  @Input()
  public set options(options: IButtonOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<ClrLoadingState>}
   * @memberof ButtonComponent
   */
  private _loadingSubject: BehaviorSubject<ClrLoadingState> = new BehaviorSubject<ClrLoadingState>(
    ClrLoadingState.DEFAULT
  );

  /**
   *
   *
   * @type {Observable<ClrLoadingState>}
   * @memberof ButtonComponent
   */
  public loading$: Observable<ClrLoadingState> = this._loadingSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @readonly
   * @type {ClrLoadingState}
   * @memberof ButtonComponent
   */
  public get loading(): ClrLoadingState {
    return this._loadingSubject.getValue();
  }

  /**
   *
   *
   * @type {ClrLoadingState}
   * @memberof ButtonComponent
   */
  @Input()
  public set loading(loading: ClrLoadingState) {
    this._loadingSubject.next(loading);
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof ButtonComponent
   */
  private _disabled: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof ButtonComponent
   */
  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof ButtonComponent
   */
  @Input()
  public set disabled(disabled: boolean) {
    this._disabled = disabled;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of ButtonComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ButtonComponent
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
   * @memberof ButtonComponent
   */
  public ngOnDestroy() {
    this._loadingSubject.complete();
    this.click$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof ButtonComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @memberof ButtonComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @memberof ButtonComponent
   */
  public onClick($event: MouseEvent): void {
    this.click$.emit($event);
  }

  /**
   *
   *
   * @memberof ButtonComponent
   */
  public setDefault(): void {
    this.loading = ClrLoadingState.DEFAULT;
  }

  /**
   *
   *
   * @memberof ButtonComponent
   */
  public setLoading(): void {
    this.loading = ClrLoadingState.LOADING;
  }

  /**
   *
   *
   * @memberof ButtonComponent
   */
  public setError(): void {
    this.loading = ClrLoadingState.ERROR;
  }

  /**
   *
   *
   * @memberof ButtonComponent
   */
  public setSuccess(): void {
    this.loading = ClrLoadingState.SUCCESS;
  }
}
