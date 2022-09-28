import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ErrorRoutingModule } from '@pages/error/error-routing.module';
import { ErrorComponent } from '@pages/error/error.component';

/**
 *
 *
 * @export
 * @class ErrorModule
 */
@NgModule({
  imports: [SharedModule, ErrorRoutingModule],
  declarations: [ErrorComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [ErrorComponent],
})
export class ErrorModule {}
