import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { WebpageResolver } from '@shared/resolvers';
import { WebpageComponent } from './webpage.component';
import { WebpageListComponent } from './webpage-list/webpage-list.component';
import { WebpageUpdateComponent } from './webpage-update/webpage-update.component';
import { WebpageDetailComponent } from './webpage-detail/webpage-detail.component';
import { WebpageDeleteComponent } from './webpage-delete/webpage-delete.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: WebpageComponent,
    data: {
      title: 'pages.webpage.index.header',
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
        component: WebpageListComponent,
        outlet: 'page',
      },
    ],
    canActivate: [AuthGuard, AclGuard],
  },
  // {
  //   path: 'delete/:id',
  //   pathMatch: 'prefix',
  //   component: WebpageDeleteComponent,
  //   resolve: {
  //     row: WebpageResolver,
  //   },
  //   data: {
  //     title: 'pages.webpage.delete.header',
  //     appLevelAlert: true,
  //     header: true,
  //     sidenav: true,
  //     subnav: true,
  //     footer: true,
  //     showHeaderSpan: false,
  //     headerStyle: 'header-7',
  //     wrapperClass: '',
  //     containerStyle: 'content-container',
  //     contentAreaStyle: 'content-area',
  //   },
  //   canActivate: [AuthGuard, AclGuard],
  // },
  {
    path: 'detail/:id',
    pathMatch: 'prefix',
    component: WebpageDetailComponent,
    resolve: {
      row: WebpageResolver,
    },
    data: {
      title: 'pages.webpage.detail.header',
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
  // should not create webpage as new one
  // {
  //   path: 'create',
  //   pathMatch: 'prefix',
  //   component: WebpageUpdateComponent,
  //   data: {
  //     title: 'pages.webpage.create.header',
  //     appLevelAlert: true,
  //     header: true,
  //     sidenav: true,
  //     subnav: true,
  //     footer: true,
  //     showHeaderSpan: false,
  //     headerStyle: 'header-7',
  //     wrapperClass: '',
  //     containerStyle: 'content-container',
  //     contentAreaStyle: 'content-area',
  //   },
  //   canActivate: [AuthGuard, AclGuard],
  // },
  {
    path: 'update/:id',
    pathMatch: 'prefix',
    component: WebpageUpdateComponent,
    resolve: {
      row: WebpageResolver,
    },
    data: {
      title: 'pages.webpage.update.header',
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
 * @class WebpageRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class WebpageRoutingModule {}
