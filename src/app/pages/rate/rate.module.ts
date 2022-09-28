import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RateRoutingModule } from '@pages/rate/rate-routing.module';
import { RateComponent } from '@pages/rate/rate.component';
// import { RateListComponent } from '@pages/rate/rate-list/rate-list.component';
// import { RateDetailComponent } from '@pages/rate/rate-detail/rate-detail.component';
// import { RateUpdateComponent } from '@pages/rate/rate-update/rate-update.component';
// import { RateDeleteComponent } from '@pages/rate/rate-delete/rate-delete.component';
// import { RateStatusComponent } from '@pages/rate/rate-status/rate-status.component';

/**
 *
 *
 * @export
 * @class RateModule
 */
@NgModule({
  imports: [SharedModule, RateRoutingModule],
  declarations: [
    RateComponent,
    // RateListComponent,
    // RateDetailComponent,
    // RateUpdateComponent,
    // RateDeleteComponent,
    // RateStatusComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [RateComponent],
})
export class RateModule {}
