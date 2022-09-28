import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { CategoryResolver } from '@shared/resolvers';
import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryUpdateComponent } from './category-update/category-update.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryDeleteComponent } from './category-delete/category-delete.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: CategoryComponent,
    data: {
      title: 'pages.category.index.header',
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
        component: CategoryListComponent,
        outlet: 'page',
      },
    ],
    canActivate: [AuthGuard, AclGuard],
  },
  {
    path: 'delete/:id',
    pathMatch: 'prefix',
    component: CategoryDeleteComponent,
    resolve: {
      row: CategoryResolver,
    },
    data: {
      title: 'pages.category.delete.header',
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
    path: 'detail/:id',
    pathMatch: 'prefix',
    component: CategoryDetailComponent,
    resolve: {
      row: CategoryResolver,
    },
    data: {
      title: 'pages.category.detail.header',
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
    path: 'create',
    pathMatch: 'prefix',
    component: CategoryUpdateComponent,
    data: {
      title: 'pages.category.create.header',
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
    path: 'update/:id',
    pathMatch: 'prefix',
    component: CategoryUpdateComponent,
    resolve: {
      row: CategoryResolver,
    },
    data: {
      title: 'pages.category.update.header',
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
 * @class CategoryRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class CategoryRoutingModule {}
