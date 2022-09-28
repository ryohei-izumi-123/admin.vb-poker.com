// import 'reflect-metadata';
// import '../polyfills';
import { environment } from '@env/environment';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NgModule,
  APP_INITIALIZER,
  APP_BOOTSTRAP_LISTENER,
  LOCALE_ID,
  // TRANSLATIONS,
  // TRANSLATIONS_FORMAT,
  ErrorHandler as DefaultErrorHandler,
  Provider,
} from '@angular/core';
import { CommonModule, APP_BASE_HREF, JsonPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEnEx from '@angular/common/locales/extra/en';
import localeJa from '@angular/common/locales/ja';
import localeJaEx from '@angular/common/locales/extra/ja';
// import localeCn from '@angular/common/locales/zh-Hans';
// import localeCnEx from '@angular/common/locales/extra/zh-Hans';
import { ServiceWorkerModule } from '@angular/service-worker';
const initLocaleData: () => void = () => {
  registerLocaleData(localeEn, localeEnEx);
  registerLocaleData(localeJa, localeJaEx);
  // registerLocaleData(localeCn, localeCnEx);
};
initLocaleData();

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import {
  TranslateModule,
  TranslateModuleConfig,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import * as Sentry from '@sentry/angular';
import { AgmCoreModule, LazyMapsAPILoaderConfigLiteral } from '@agm/core';
import {
  ToastrModule as NgxToastrModule,
  GlobalConfig as NgxToastrGlobalConfig,
} from 'ngx-toastr';
import { JoyrideModule } from 'ngx-joyride';
import { QuicklinkStrategy, QuicklinkModule } from 'ngx-quicklink';
import { SharedModule } from '@shared/shared.module';
import { ToasterComponent } from '@shared/components/toaster/toaster.component';
import { PrettifyJsonPipe } from '@shared/pipes/prettify-json.pipe';
import { CoreModule } from '@core/core.module';
import { ApiInterceptor } from '@core/class/api-interceptor';
import {
  AppInitializer,
  AppInitializerFactory,
} from '@core/class/app-initializer';
import {
  AppBootstrapListener,
  AppBootstrapListenerFactory,
} from '@core/class/app-bootstrap-listener';
import { AppErrorHandler as CustomErrorHandler } from '@core/class/app-error-handler';
import { AppMissingTranslationHandler } from '@core/class/app-missing-translation-handler';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

declare type TTranslateLoaderFactory = (c: HttpClient) => TranslateHttpLoader;
export const TranslateLoaderFactory: TTranslateLoaderFactory = (
  http: HttpClient
) => {
  const prefix: string = `/${environment.api.endpoint.api}/languages/`;
  const suffix: string = '';
  return new TranslateHttpLoader(http, prefix, suffix);
};

export const AppErrorHandler: Provider = {
  provide: DefaultErrorHandler,
  useClass: CustomErrorHandler,
};

/**
 * @see https://docs.sentry.io/platforms/javascript/guides/angular/
 */
export const SentryTraceService: Provider = {
  provide: Sentry.TraceService,
  deps: [Router],
  multi: true,
};

export const ROOT_NGX_TRANSLATE_MODULE_CONFIG: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: TranslateLoaderFactory,
    deps: [HttpClient],
  },
  missingTranslationHandler: {
    provide: MissingTranslationHandler,
    useClass: AppMissingTranslationHandler,
  },
};

export const ROOT_AGM_MODULE_CONFIG: LazyMapsAPILoaderConfigLiteral = {
  apiKey: environment.google.map.apiKey,
};

export const ROOT_NGX_TOASTR_MODULE_CONFIG: Partial<NgxToastrGlobalConfig> = {
  maxOpened: 5,
  autoDismiss: true,
  iconClasses: {
    error: 'toast-error',
    info: 'toast-info',
    success: 'toast-success',
    warning: 'toast-warning',
  },
  newestOnTop: true,
  preventDuplicates: false,
  countDuplicates: false,
  resetTimeoutOnDuplicate: true,
  positionClass: 'toast-top-left',
  disableTimeOut: false,
  timeOut: 5000,
  closeButton: false,
  extendedTimeOut: 1000,
  progressBar: false,
  progressAnimation: 'decreasing',
  enableHtml: false,
  toastClass: 'toaster',
  titleClass: 'toast-title',
  messageClass: 'toast-message',
  easing: 'ease-in',
  easeTime: 300,
  tapToDismiss: true,
  onActivateTick: false,
  toastComponent: ToasterComponent,
};

/**
 *
 *
 * @export
 * @class AppModule
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot(ROOT_NGX_TRANSLATE_MODULE_CONFIG),
    AgmCoreModule.forRoot(ROOT_AGM_MODULE_CONFIG),
    NgxToastrModule.forRoot(ROOT_NGX_TOASTR_MODULE_CONFIG),
    JoyrideModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    QuicklinkModule,
    RouterModule.forRoot([], {
      preloadingStrategy: QuicklinkStrategy,
    }),
  ],
  providers: [
    AppErrorHandler,
    SentryTraceService,
    {
      provide: LOCALE_ID,
      useValue: environment.locale.default,
    },
    {
      provide: APP_BASE_HREF,
      useValue: environment.base_href,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: AppInitializerFactory,
      deps: [AppInitializer, Sentry.TraceService],
      multi: true,
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      useFactory: AppBootstrapListenerFactory,
      deps: [AppBootstrapListener],
      multi: true,
    },
    {
      provide: JsonPipe,
      useValue: [PrettifyJsonPipe],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [AppComponent],
})
export class AppModule {}
