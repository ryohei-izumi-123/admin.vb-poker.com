import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { AclRoutingModule } from '@pages/acl/acl-routing.module';
import { AclComponent } from '@pages/acl/acl.component';
import { AclTreeComponent } from '@pages/acl/acl-tree/acl-tree.component';

/**
 *
 *
 * @export
 * @class AclModule
 */
@NgModule({
  imports: [SharedModule, AclRoutingModule],
  declarations: [AclComponent, AclTreeComponent],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [AclComponent],
})
export class AclModule {}
