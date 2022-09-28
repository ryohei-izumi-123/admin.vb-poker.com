import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { AccountResolver } from '@shared/resolvers';
import { AccountComponent } from './account.component';
import { AccountUpdateComponent } from './account-update/account-update.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { AccountSecurityComponent } from './account-security/account-security.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: AccountComponent,
    data: {
      title: 'pages.account.index.header',
      appLevelAlert: true,
      header: true,
      sidenav: true,
      subnav: true,
      footer: true,
      showHeaderSpan: false,
      headerStyle: 'header-7',
      wrapperClass: '',
      containerStyle: 'content-container',
      contentAreaStyle: 'content-area',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: AccountDetailComponent,
        outlet: 'page',
        resolve: {
          row: AccountResolver,
        },
      },
    ],
    canActivate: [AuthGuard, AclGuard],
  },
  {
    path: 'security',
    pathMatch: 'prefix',
    component: AccountSecurityComponent,
    resolve: {
      row: AccountResolver,
    },
    data: {
      title: 'pages.account.security.header',
      appLevelAlert: true,
      header: true,
      sidenav: true,
      subnav: true,
      footer: true,
      showHeaderSpan: false,
      headerStyle: 'header-7',
      wrapperClass: '',
      containerStyle: 'content-container',
      contentAreaStyle: 'content-area',
    },
    canActivate: [AuthGuard, AclGuard],
  },
  {
    path: 'update',
    pathMatch: 'prefix',
    component: AccountUpdateComponent,
    resolve: {
      row: AccountResolver,
    },
    data: {
      title: 'pages.account.create.header',
      appLevelAlert: true,
      header: true,
      sidenav: true,
      subnav: true,
      footer: true,
      showHeaderSpan: false,
      headerStyle: 'header-7',
      wrapperClass: '',
      containerStyle: 'content-container',
      contentAreaStyle: 'content-area',
    },
    canActivate: [AuthGuard, AclGuard],
  },
  {
    path: '**',
    redirectTo: 'index',
  },
];

/**
 *
 *
 * @export
 * @class AccountRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AccountRoutingModule {}
