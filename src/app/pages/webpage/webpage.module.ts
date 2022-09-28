import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { WebpageRoutingModule } from '@pages/webpage/webpage-routing.module';
import { WebpageComponent } from '@pages/webpage/webpage.component';
import { WebpageListComponent } from '@pages/webpage/webpage-list/webpage-list.component';
import { WebpageDetailComponent } from '@pages/webpage/webpage-detail/webpage-detail.component';
import { WebpageUpdateComponent } from '@pages/webpage/webpage-update/webpage-update.component';
import { WebpageDeleteComponent } from '@pages/webpage/webpage-delete/webpage-delete.component';
import { WebpageStatusComponent } from '@pages/webpage/webpage-status/webpage-status.component';

/**
 *
 *
 * @export
 * @class WebpageModule
 */
@NgModule({
  imports: [SharedModule, WebpageRoutingModule],
  declarations: [
    WebpageComponent,
    WebpageListComponent,
    WebpageDetailComponent,
    WebpageUpdateComponent,
    WebpageDeleteComponent,
    WebpageStatusComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [WebpageComponent],
})
export class WebpageModule {}
