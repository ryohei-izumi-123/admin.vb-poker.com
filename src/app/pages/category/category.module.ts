import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CategoryRoutingModule } from '@pages/category/category-routing.module';
import { CategoryComponent } from '@pages/category/category.component';
import { CategoryListComponent } from '@pages/category/category-list/category-list.component';
import { CategoryDetailComponent } from '@pages/category/category-detail/category-detail.component';
import { CategoryUpdateComponent } from '@pages/category/category-update/category-update.component';
import { CategoryDeleteComponent } from '@pages/category/category-delete/category-delete.component';
import { CategoryStatusComponent } from '@pages/category/category-status/category-status.component';

/**
 *
 *
 * @export
 * @class CategoryModule
 */
@NgModule({
  imports: [SharedModule, CategoryRoutingModule],
  declarations: [
    CategoryComponent,
    CategoryListComponent,
    CategoryDetailComponent,
    CategoryUpdateComponent,
    CategoryDeleteComponent,
    CategoryStatusComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [CategoryComponent],
})
export class CategoryModule {}
