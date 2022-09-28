import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  BaseComponent,
  BaseDeleteComponent,
  BaseDetailComponent,
  BaseFilterComponent,
  BaseFormComponent,
  BaseListComponent,
  BasePasswordComponent,
  BaseStatusComponent,
  BaseToasterComponent,
  BaseWizardComponent,
  BaseTreeComponent,
  BaseUpdateComponent,
  BaseIfDirective,
  BaseDirective,
  ThrowIfAlreadyLoaded,
} from './class';
const components: any = [
  BaseComponent,
  BaseDeleteComponent,
  BaseDetailComponent,
  BaseFilterComponent,
  BaseFormComponent,
  BaseListComponent,
  BasePasswordComponent,
  BaseStatusComponent,
  BaseToasterComponent,
  BaseWizardComponent,
  BaseTreeComponent,
  BaseUpdateComponent,
];
const directives: any[] = [BaseIfDirective, BaseDirective];
@NgModule({
  declarations: [...components, ...directives],
})
export class CoreModule {
  /**
   * Creates an instance of CoreModule.
   * @param {CoreModule} [parentModule]
   * @memberof CoreModule
   */
  public constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    ThrowIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
