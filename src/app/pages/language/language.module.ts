import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { LanguageRoutingModule } from '@pages/language/language-routing.module';
import { LanguageComponent } from '@pages/language/language.component';
import { LanguageListComponent } from '@pages/language/language-list/language-list.component';
import { LanguageDetailComponent } from '@pages/language/language-detail/language-detail.component';
import { LanguageUpdateComponent } from '@pages/language/language-update/language-update.component';
import { LanguageDeleteComponent } from '@pages/language/language-delete/language-delete.component';
import { LanguageStatusComponent } from '@pages/language/language-status/language-status.component';

/**
 *
 *
 * @export
 * @class LanguageModule
 */
@NgModule({
  imports: [SharedModule, LanguageRoutingModule],
  declarations: [
    LanguageComponent,
    LanguageListComponent,
    LanguageDetailComponent,
    LanguageUpdateComponent,
    LanguageDeleteComponent,
    LanguageStatusComponent,
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [LanguageComponent],
})
export class LanguageModule {}
