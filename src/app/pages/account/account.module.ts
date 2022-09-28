import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AccountRoutingModule } from '@pages/account/account-routing.module';
import { AccountComponent } from '@pages/account/account.component';
import { AccountSecurityComponent } from '@pages/account/account-security/account-security.component';
import { AccountDetailComponent } from '@pages/account/account-detail/account-detail.component';
import { AccountUpdateComponent } from '@pages/account/account-update/account-update.component';

/**
 *
 *
 * @export
 * @class AccountModule
 */
@NgModule({
  imports: [SharedModule, AccountRoutingModule],
  declarations: [
    AccountComponent,
    AccountDetailComponent,
    AccountUpdateComponent,
    AccountSecurityComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AccountComponent],
})
export class AccountModule {}
