import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { ClrWizard } from '@clr/angular';
import { BaseComponent } from '@core/class/base.component';
/**
 *
 *
 * @export
 * @class BaseWizardComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-wizard',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseWizardComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {EventEmitter<boolean>}
   * @memberof BaseWizardComponent
   */
  @Output()
  public onComplete$: EventEmitter<boolean> = new EventEmitter();

  /**
   *
   *
   * @type {string}
   * @memberof BaseWizardComponent
   */
  public pageIdPrefix: string = 'clr-wizard-page-';

  /**
   *
   *
   * @type {ClrWizard}
   * @memberof BaseWizardComponent
   */
  @ViewChild('$wizard')
  public $wizard: ClrWizard;

  /**
   *
   *
   * @protected
   * @type {boolean}
   * @memberof BaseWizardComponent
   */
  protected _isOpen: boolean = false;

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseWizardComponent
   */
  public get isOpen(): boolean {
    return this._isOpen;
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseWizardComponent
   */
  public set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof BaseWizardComponent
   */
  public get step(): number {
    if (this.$wizard) {
      const id: string = this.$wizard.currentPage.id;
      return _.toNumber(id.replace(this.pageIdPrefix, ''));
    }

    return 0;
  }

  /**
   * Creates an instance of BaseWizardComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseWizardComponent
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
   * @memberof BaseWizardComponent
   */
  public ngAfterViewInit() {
    this.$wizard.reset();
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public ngOnDestroy() {
    this.onComplete$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public open(): void {
    this.$wizard.open();
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public close(): void {
    this.$wizard.close();
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public next(): void {
    this.$wizard.next();
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public prev(): void {
    this.$wizard.previous();
  }

  /**
   *
   *
   * @param {number} step
   * @memberof BaseWizardComponent
   */
  public goto(step: number): void {
    this.$wizard.goTo(`${this.pageIdPrefix}${step}`);
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public onPageChanged(): void {
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public onCancel(): void {
    this.$wizard.reset();
    this.onComplete$.emit(false);
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public onFinish(): void {
    this.$wizard.reset();
    this.onComplete$.emit(true);
  }

  /**
   *
   *
   * @memberof BaseWizardComponent
   */
  public onReset(): void {}
}
