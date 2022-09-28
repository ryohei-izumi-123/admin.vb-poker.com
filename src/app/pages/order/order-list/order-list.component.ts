import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { IOrder } from '@shared/interfaces';
import { CsvService, OrderService } from '@shared/services';
import { OrderStatusComponent } from '@pages/order/order-status/order-status.component';
import { BaseListComponent } from '@core/class/base-list.component';

/**
 *
 *
 * @export
 * @class OrderListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent
  extends BaseListComponent<IOrder, OrderService, OrderStatusComponent>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of OrderListComponent.
   * @param {TranslateService} _translateSvc
   * @param {OrderService} _orderSvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof OrderListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _orderSvc: OrderService,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _orderSvc, _csvSvc, _router, _changeDetectorRef);
  }

  /**
   *
   * @returns {IOrder[]}
   * @memberof OrderListComponent
   */
  public exportAsCsv(): IOrder[] {
    const filename: string = `download-${this.pageName}`;
    const data: IOrder[] = _.cloneDeep(this.rows).map((row: IOrder) => {
      return {
        id: row.id,
        name: row.name,
        orderName: row.order.name,
        price: row.price,
        remarks: row.remarks,
        status: row.status,
      };
    });

    return this._csvSvc.generate<IOrder>(data, filename);
  }
}
