import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserRoutingModule } from '@pages/user/user-routing.module';
import { UserComponent } from '@pages/user/user.component';
import { UserListComponent } from '@pages/user/user-list/user-list.component';
import { UserDetailComponent } from '@pages/user/user-detail/user-detail.component';
import { UserUpdateComponent } from '@pages/user/user-update/user-update.component';
import { UserDeleteComponent } from '@pages/user/user-delete/user-delete.component';
import { UserStatusComponent } from '@pages/user/user-status/user-status.component';
import { UserPasswordComponent } from '@pages/user/user-password/user-password.component';

/**
 *
 *
 * @export
 * @class UserModule
 */
@NgModule({
  imports: [SharedModule, UserRoutingModule],
  declarations: [
    UserComponent,
    UserListComponent,
    UserDetailComponent,
    UserUpdateComponent,
    UserDeleteComponent,
    UserStatusComponent,
    UserPasswordComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [UserComponent],
})
export class UserModule {}
