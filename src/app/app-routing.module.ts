import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/login/login.module').then(
        (ngModule) => ngModule.LoginModule
      ),
  },
  {
    path: 'logout',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/logout/logout.module').then(
        (ngModule) => ngModule.LogoutModule
      ),
  },
  {
    path: 'home',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/home/home.module').then((ngModule) => ngModule.HomeModule),
  },
  {
    path: 'language',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/language/language.module').then(
        (ngModule) => ngModule.LanguageModule
      ),
  },
  {
    path: 'webpage',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/webpage/webpage.module').then(
        (ngModule) => ngModule.WebpageModule
      ),
  },
  {
    path: 'acl',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/acl/acl.module').then((ngModule) => ngModule.AclModule),
  },
  {
    path: 'category',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/category/category.module').then(
        (ngModule) => ngModule.CategoryModule
      ),
  },
  {
    path: 'user',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/user/user.module').then((ngModule) => ngModule.UserModule),
  },
  {
    path: 'customer',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/customer/customer.module').then(
        (ngModule) => ngModule.CustomerModule
      ),
  },
  {
    path: 'order',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/order/order.module').then(
        (ngModule) => ngModule.OrderModule
      ),
  },
  {
    path: 'ticket',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/ticket/ticket.module').then(
        (ngModule) => ngModule.TicketModule
      ),
  },
  {
    path: 'product',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/product/product.module').then(
        (ngModule) => ngModule.ProductModule
      ),
  },
  {
    path: 'rate',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/rate/rate.module').then((ngModule) => ngModule.RateModule),
  },
  {
    path: 'inquiry',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/inquiry/inquiry.module').then(
        (ngModule) => ngModule.InquiryModule
      ),
  },
  {
    path: 'setting',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/setting/setting.module').then(
        (ngModule) => ngModule.SettingModule
      ),
  },
  {
    path: 'account',
    pathMatch: 'prefix',
    loadChildren: () =>
      import('@pages/account/account.module').then(
        (ngModule) => ngModule.AccountModule
      ),
  },

  {
    path: '.well-known/acme-challenge/:token',
    pathMatch: 'prefix',
    redirectTo: 'login/index',
  },
  {
    path: '**',
    loadChildren: () =>
      import('@pages/error/error.module').then(
        (ngModule) => ngModule.ErrorModule
      ),
  },
];

/**
 *
 *
 * @export
 * @class AppRoutingModule
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0],
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
