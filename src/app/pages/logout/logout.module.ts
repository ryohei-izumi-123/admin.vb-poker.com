import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LogoutRoutingModule } from '@pages/logout/logout-routing.module';
import { LogoutComponent } from '@pages/logout/logout.component';

/**
 *
 *
 * @export
 * @class LogoutModule
 */
@NgModule({
  imports: [SharedModule, LogoutRoutingModule],
  declarations: [LogoutComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LogoutComponent],
})
export class LogoutModule {}
