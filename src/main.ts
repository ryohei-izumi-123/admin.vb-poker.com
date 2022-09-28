import { environment } from '@env/environment';
import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { hmrBootstrap, IBootstrap } from './hmr';
const setProd = () => {
  if (environment.production) {
    enableProdMode();
  }
};
const bootstrap: IBootstrap = (): Promise<NgModuleRef<AppModule>> =>
  platformBrowserDynamic().bootstrapModule(AppModule, {
    preserveWhitespaces: false,
    ngZoneEventCoalescing: true,
  });

const setServiceWorker = () => {
  if ('serviceWorker' in navigator && environment.production) {
    navigator.serviceWorker
      .register('/ngsw-worker.js')
      .then((registration: ServiceWorkerRegistration) => {
        registration.onupdatefound = () => {
          console.info('[SW UPDATE] found update.');
          registration.update();
        };
      })
      .catch(console.error.bind(console));
  }
};

setProd();
if (environment.hmr) {
  hmrBootstrap(module, bootstrap);
} else {
  setServiceWorker();
  document.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(console.error.bind(console));
  });
}
