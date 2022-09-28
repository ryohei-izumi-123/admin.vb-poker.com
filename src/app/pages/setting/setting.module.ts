import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SettingRoutingModule } from '@pages/setting/setting-routing.module';
import { SettingComponent } from '@pages/setting/setting.component';
import { SettingDetailComponent } from '@pages/setting/setting-detail/setting-detail.component';
import { SettingUpdateComponent } from '@pages/setting/setting-update/setting-update.component';

/**
 *
 *
 * @export
 * @class SettingModule
 */
@NgModule({
  imports: [SharedModule, SettingRoutingModule],
  declarations: [
    SettingComponent,
    SettingDetailComponent,
    SettingUpdateComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [SettingComponent],
})
export class SettingModule {}
