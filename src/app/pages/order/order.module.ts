import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OrderRoutingModule } from '@pages/order/order-routing.module';
import { OrderComponent } from '@pages/order/order.component';
import { OrderListComponent } from '@pages/order/order-list/order-list.component';
import { OrderDetailComponent } from '@pages/order/order-detail/order-detail.component';
import { OrderUpdateComponent } from '@pages/order/order-update/order-update.component';
import { OrderDeleteComponent } from '@pages/order/order-delete/order-delete.component';
import { OrderStatusComponent } from '@pages/order/order-status/order-status.component';

/**
 *
 *
 * @export
 * @class OrderModule
 */
@NgModule({
  imports: [SharedModule, OrderRoutingModule],
  declarations: [
    OrderComponent,
    OrderListComponent,
    OrderDetailComponent,
    OrderUpdateComponent,
    OrderDeleteComponent,
    OrderStatusComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [OrderComponent],
})
export class OrderModule {}
