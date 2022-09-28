import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { InquiryRoutingModule } from '@pages/inquiry/inquiry-routing.module';
import { InquiryComponent } from '@pages/inquiry/inquiry.component';
import { InquiryListComponent } from '@pages/inquiry/inquiry-list/inquiry-list.component';
import { InquiryDetailComponent } from '@pages/inquiry/inquiry-detail/inquiry-detail.component';
import { InquiryUpdateComponent } from '@pages/inquiry/inquiry-update/inquiry-update.component';
import { InquiryDeleteComponent } from '@pages/inquiry/inquiry-delete/inquiry-delete.component';
import { InquiryStatusComponent } from '@pages/inquiry/inquiry-status/inquiry-status.component';

/**
 *
 *
 * @export
 * @class InquiryModule
 */
@NgModule({
  imports: [SharedModule, InquiryRoutingModule],
  declarations: [
    InquiryComponent,
    InquiryListComponent,
    InquiryDetailComponent,
    InquiryUpdateComponent,
    InquiryDeleteComponent,
    InquiryStatusComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [InquiryComponent],
})
export class InquiryModule {}
