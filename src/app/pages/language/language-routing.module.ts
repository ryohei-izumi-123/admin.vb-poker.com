import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { LanguageResolver } from '@shared/resolvers';
import { LanguageComponent } from './language.component';
import { LanguageListComponent } from './language-list/language-list.component';
import { LanguageUpdateComponent } from './language-update/language-update.component';
import { LanguageDetailComponent } from './language-detail/language-detail.component';
import { LanguageDeleteComponent } from './language-delete/language-delete.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: LanguageComponent,
    data: {
      title: 'pages.language.index.header',
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
        component: LanguageListComponent,
        outlet: 'page',
      },
    ],
    canActivate: [AuthGuard, AclGuard],
  },
  // {
  //   path: 'delete/:id',
  //   pathMatch: 'prefix',
  //   component: LanguageDeleteComponent,
  //   resolve: {
  //     row: LanguageResolver,
  //   },
  //   data: {
  //     title: 'pages.language.delete.header',
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
    component: LanguageDetailComponent,
    resolve: {
      row: LanguageResolver,
    },
    data: {
      title: 'pages.language.detail.header',
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
  // should not create language as new one
  // {
  //   path: 'create',
  //   pathMatch: 'prefix',
  //   component: LanguageUpdateComponent,
  //   data: {
  //     title: 'pages.language.create.header',
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
    component: LanguageUpdateComponent,
    resolve: {
      row: LanguageResolver,
    },
    data: {
      title: 'pages.language.update.header',
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
 * @class LanguageRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class LanguageRoutingModule {}
