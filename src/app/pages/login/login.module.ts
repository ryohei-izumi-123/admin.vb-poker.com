import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LoginRoutingModule } from '@pages/login/login-routing.module';
import { LoginComponent } from '@pages/login/login.component';

/**
 *
 *
 * @export
 * @class LoginModule
 */
@NgModule({
  imports: [SharedModule, LoginRoutingModule],
  declarations: [LoginComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LoginComponent],
})
export class LoginModule {}
