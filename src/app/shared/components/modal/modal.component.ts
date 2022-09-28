import {
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, NavigationStart, Event as Event$ } from '@angular/router';
import { ClrModal } from '@clr/angular';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from '@core/class/base.component';
import { IModalOptions } from '@shared/interfaces';

@Component({
  selector: 'admin-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @type {ClrModal}
   * @memberof ModalComponent
   */
  @ViewChild('$modal')
  public $modal: ClrModal;

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof ModalComponent
   */
  private _isOpen: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof ModalComponent
   */
  public get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   *
   *
   * @type {boolean}
   * @memberof ModalComponent
   */
  @Input()
  public set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {IModalOptions}
   * @memberof ModalComponent
   */
  private _options: IModalOptions = {
    isClosable: true,
    hasBackdrop: true,
    skipAnimation: false,
    size: 'lg',
  };

  /**
   *
   *
   * @readonly
   * @type {IModalOptions}
   * @memberof ModalComponent
   */
  public get options(): IModalOptions {
    return this._options;
  }

  /**
   *
   *
   * @type {IModalOptions}
   * @memberof ModalComponent
   */
  @Input()
  public set options(options: IModalOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of ModalComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ModalComponent
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
   * @memberof ModalComponent
   */
  public ngOnInit() {
    super.ngOnInit();
    this._subscription.add(
      this._router.events
        .pipe(filter(($event: Event$) => $event instanceof NavigationStart))
        .subscribe(() => this.close())
    );
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof ModalComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   *
   * @memberof ModalComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @memberof ModalComponent
   */
  public open(): void {
    this.isOpen = true;
  }

  /**
   *
   *
   * @memberof ModalComponent
   */
  public close(): void {
    this.isOpen = false;
  }
}
