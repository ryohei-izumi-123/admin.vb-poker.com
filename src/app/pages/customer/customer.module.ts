import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CustomerRoutingModule } from '@pages/customer/customer-routing.module';
import { CustomerComponent } from '@pages/customer/customer.component';
import { CustomerListComponent } from '@pages/customer/customer-list/customer-list.component';
import { CustomerDetailComponent } from '@pages/customer/customer-detail/customer-detail.component';
import { CustomerUpdateComponent } from '@pages/customer/customer-update/customer-update.component';
import { CustomerDeleteComponent } from '@pages/customer/customer-delete/customer-delete.component';
import { CustomerStatusComponent } from '@pages/customer/customer-status/customer-status.component';
import { CustomerPasswordComponent } from '@pages/customer/customer-password/customer-password.component';

/**
 *
 *
 * @export
 * @class CustomerModule
 */
@NgModule({
  imports: [SharedModule, CustomerRoutingModule],
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CustomerDetailComponent,
    CustomerUpdateComponent,
    CustomerDeleteComponent,
    CustomerStatusComponent,
    CustomerPasswordComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [CustomerComponent],
})
export class CustomerModule {}
