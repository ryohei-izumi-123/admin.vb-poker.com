import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { SettingResolver } from '@shared/resolvers';
import { SettingComponent } from './setting.component';
import { SettingUpdateComponent } from './setting-update/setting-update.component';
import { SettingDetailComponent } from './setting-detail/setting-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: SettingComponent,
    data: {
      title: 'pages.setting.index.header',
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
        component: SettingDetailComponent,
        outlet: 'page',
        resolve: {
          row: SettingResolver,
        },
      },
    ],
    canActivate: [AuthGuard, AclGuard],
  },
  {
    path: 'update',
    pathMatch: 'prefix',
    component: SettingUpdateComponent,
    resolve: {
      row: SettingResolver,
    },
    data: {
      title: 'pages.setting.create.header',
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
 * @class SettingRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class SettingRoutingModule {}
