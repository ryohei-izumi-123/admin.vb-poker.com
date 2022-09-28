import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Validators,
  AbstractControl,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppValidator } from '@core/class/app-validator';
import { IOption, IOrder, ICategory } from '@shared/interfaces';
import {
  OrderService,
  OptionService,
  ValidateService,
  ToasterService,
} from '@shared/services';
import { BaseUpdateComponent } from '@core/class/base-update.component';

/**
 *
 *
 * @export
 * @class OrderUpdateComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-order-update',
  templateUrl: './order-update.component.html',
  styleUrls: ['./order-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderUpdateComponent
  extends BaseUpdateComponent<IOrder, OrderService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof OrderUpdateComponent
   */
  protected _modelName: string = 'orders';

  /**
   *
   *
   * @type {ICategory[]}
   * @memberof OrderUpdateComponent
   */
  public categories: ICategory[] = [];

  /**
   * Creates an instance of OrderUpdateComponent.
   * @param {TranslateService} _translateSvc
   * @param {ValidateService} _validateSvc
   * @param {ToasterService} _toasterSvc
   * @param {OrderService} _orderSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof OrderUpdateComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _validateSvc: ValidateService,
    protected _toasterSvc: ToasterService,
    protected _optionSvc: OptionService,
    protected _orderSvc: OrderService,
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _validateSvc,
      _toasterSvc,
      _orderSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof OrderUpdateComponent
   */
  public ngOnInit() {
    this.initCategories();
    super.ngOnInit();
  }

  /**
   *
   *
   * @memberof OrderUpdateComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      categoryId: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(64),
        ])
      ),
      price: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.min(0.0001),
          Validators.max(1000000000),
          AppValidator.isDecimal,
        ])
      ),
      status: new FormControl(null, Validators.compose([Validators.required])),
      remarks: new FormControl(
        '',
        Validators.compose([Validators.maxLength(3000)])
      ),
    });

    this.setAsyncValidators();
  }

  /**
   *
   *
   * @protected
   * @memberof OrderUpdateComponent
   */
  protected setAsyncValidators(): void {
    this.validateName$();
  }

  /**
   *
   *
   * @memberof OrderUpdateComponent
   */
  public validateName$(): void {
    const ctrl: AbstractControl = this.getFormCtrl('name');
    const validators = [this.validateIsUnique$('name')];

    this.resetAsyncValidator(ctrl);
    this.setAsyncValidator(ctrl, validators);
  }

  /**
   *
   *
   * @private
   * @return {Subscription}
   * @memberof OrderUpdateComponent
   */
  private initCategories(): Subscription {
    return this._subscription.add(
      this._optionSvc
        .getOption$()
        .pipe(
          map((option: IOption) => option.categories),
          take(1)
        )
        .subscribe((data: ICategory[]) => {
          this.categories = data;
          this._changeDetectorRef.markForCheck();
        })
    );
  }
}
