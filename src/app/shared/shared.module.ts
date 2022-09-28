import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxCaptchaModule } from 'ngx-captcha';
import { AvatarModule } from 'ngx-avatar';
import { ClarityModule } from '@clr/angular';
// tslint:disable-next-line: no-import-side-effect
import '@clr/icons';
// tslint:disable-next-line: no-import-side-effect
import '@clr/icons/shapes/all-shapes';
// `angular.json`側で`"scripts": ["./node_modules/@clr/icons/clr-icons.min.js"]`を指定しているとカスタイムアイコンの登録ができないので注意。
import { AgmCoreModule } from '@agm/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { QRCodeModule } from 'angularx-qrcode';
import { JoyrideModule, JoyrideStepComponent } from 'ngx-joyride';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { QuicklinkModule } from 'ngx-quicklink';
import { Options as AjvOptions } from 'ajv';
import * as ajv from 'ajv';
import { AJV_CLASS, AJV_CONFIG, AJV_INSTANCE } from '@shared/tokens';
export const AjvFactory: (...args: any) => any = (
  AjvClazz: any,
  config: AjvOptions
) => {
  return new AjvClazz(config);
};

import {
  FileValueAccessorDirective,
  WebviewDirective,
  DraggableDirective,
  RecaptchaDirective,
  IfMobileDirective,
  HasAclDirective,
  OnlyNumberDirective,
  IfAuthDirective,
} from '@shared/directives';
import {
  BignumberPipe,
  InflectorPipe,
  MdToHtmlPipe,
  MomentPipe,
  Nl2brPipe,
  QrPipe,
  StatusPipe,
  SafePipe,
  RolePipe,
  AclPipe,
  UnescapePipe,
  LocalePipe,
  PageTypePipe,
  ScopePipe,
  PrettifyJsonPipe,
} from '@shared/pipes';
import {
  LinkComponent,
  ButtonComponent,
  AlertComponent,
  AlertsComponent,
  AvatarComponent,
  SidenavComponent,
  SubnavComponent,
  ContentAreaComponent,
  ContentContainerComponent,
  SignpostIconComponent,
  TooltipIconComponent,
  ClockComponent,
  PreloaderComponent,
  HeaderComponent,
  FooterComponent,
  RecaptchaComponent,
  LoginFormComponent,
  TotpFormComponent,
  DatagridFormComponent,
  IconComponent,
  ToasterComponent,
  TotpWizardComponent,
  CardLayoutComponent,
  ModalComponent,
  ThemeSelectorComponent,
  ButtonGroupComponent,
  NoAddressAlertComponent,
  StatusFilterComponent,
  RoleFilterComponent,
  OptionFilterComponent,
  NumericFilterComponent,
  RangeFilterComponent,
  ChartComponent,
  BackButtonComponent,
  DatalistFilterComponent,
  OfflineComponent,
  LocaleSelectorComponent,
  ArrayFilterComponent,
  JsonEditorComponent,
  LanguageJsonEditorComponent,
} from '@shared/components';
import { SocketService, SocketFactory } from '@shared/services/socket.service';
import { JwtService } from '@shared/services/jwt.service';
import { LoggerService } from '@shared/services/logger.service';
import { SOCKET_OPTIONS } from '@shared/tokens';

const directives: any[] = [
  FileValueAccessorDirective,
  WebviewDirective,
  DraggableDirective,
  RecaptchaDirective,
  IfMobileDirective,
  HasAclDirective,
  OnlyNumberDirective,
  IfAuthDirective,
];
const pipes: any[] = [
  BignumberPipe,
  InflectorPipe,
  MdToHtmlPipe,
  MomentPipe,
  Nl2brPipe,
  QrPipe,
  StatusPipe,
  SafePipe,
  RolePipe,
  AclPipe,
  UnescapePipe,
  LocalePipe,
  PageTypePipe,
  ScopePipe,
  PrettifyJsonPipe,
];
const components: any[] = [
  LinkComponent,
  ButtonComponent,
  AlertComponent,
  AlertsComponent,
  AvatarComponent,
  SidenavComponent,
  SubnavComponent,
  ContentAreaComponent,
  ContentContainerComponent,
  SignpostIconComponent,
  TooltipIconComponent,
  ClockComponent,
  PreloaderComponent,
  HeaderComponent,
  FooterComponent,
  RecaptchaComponent,
  LoginFormComponent,
  TotpFormComponent,
  DatagridFormComponent,
  IconComponent,
  ToasterComponent,
  TotpWizardComponent,
  CardLayoutComponent,
  ModalComponent,
  ThemeSelectorComponent,
  ButtonGroupComponent,
  NoAddressAlertComponent,
  StatusFilterComponent,
  RoleFilterComponent,
  OptionFilterComponent,
  NumericFilterComponent,
  RangeFilterComponent,
  ChartComponent,
  BackButtonComponent,
  DatalistFilterComponent,
  OfflineComponent,
  LocaleSelectorComponent,
  ArrayFilterComponent,
  JsonEditorComponent,
  LanguageJsonEditorComponent,
];
const modules: any[] = [
  RouterModule,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  TranslateModule,
  ClickOutsideModule,
  AgmCoreModule,
  LazyLoadImageModule,
  QRCodeModule,
  AvatarModule,
  ClarityModule,
  NgxCaptchaModule,
  JoyrideModule,
  NgxChartsModule,
  // NgxEditorModule,
  CKEditorModule,
  QuicklinkModule,
];
const entryComponents: any[] = [ToasterComponent, JoyrideStepComponent];
const providers: Provider[] = [
  { provide: AJV_CLASS, useValue: ajv },
  { provide: AJV_CONFIG, useValue: {} },
  {
    provide: AJV_INSTANCE,
    useFactory: AjvFactory,
    deps: [AJV_CLASS, AJV_CONFIG],
  },
  {
    provide: SOCKET_OPTIONS,
    useValue: { path: undefined },
  },
  {
    provide: SocketService,
    useFactory: SocketFactory,
    deps: [SOCKET_OPTIONS, JwtService, LoggerService],
  },
];
const schemas: any[] = [CUSTOM_ELEMENTS_SCHEMA];
@NgModule({
  declarations: [...components, ...pipes, ...directives],
  imports: [...modules],
  exports: [...modules, ...components, ...pipes, ...directives],
  entryComponents: [...entryComponents],
  providers: [...providers],
  schemas: [...schemas],
})
export class SharedModule {}
