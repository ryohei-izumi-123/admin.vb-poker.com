import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ProductRoutingModule } from '@pages/product/product-routing.module';
import { ProductComponent } from '@pages/product/product.component';
import { ProductListComponent } from '@pages/product/product-list/product-list.component';
import { ProductDetailComponent } from '@pages/product/product-detail/product-detail.component';
import { ProductUpdateComponent } from '@pages/product/product-update/product-update.component';
import { ProductDeleteComponent } from '@pages/product/product-delete/product-delete.component';
import { ProductStatusComponent } from '@pages/product/product-status/product-status.component';

/**
 *
 *
 * @export
 * @class ProductModule
 */
@NgModule({
  imports: [SharedModule, ProductRoutingModule],
  declarations: [
    ProductComponent,
    ProductListComponent,
    ProductDetailComponent,
    ProductUpdateComponent,
    ProductDeleteComponent,
    ProductStatusComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ProductComponent],
})
export class ProductModule {}
