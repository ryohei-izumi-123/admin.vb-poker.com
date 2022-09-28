import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { ProductResolver } from '@shared/resolvers';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductDeleteComponent } from './product-delete/product-delete.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: ProductComponent,
    data: {
      title: 'pages.product.index.header',
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
        component: ProductListComponent,
        outlet: 'page',
      },
    ],
    canActivate: [AuthGuard, AclGuard],
  },
  {
    path: 'delete/:id',
    pathMatch: 'prefix',
    component: ProductDeleteComponent,
    resolve: {
      row: ProductResolver,
    },
    data: {
      title: 'pages.product.delete.header',
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
    component: ProductDetailComponent,
    resolve: {
      row: ProductResolver,
    },
    data: {
      title: 'pages.product.detail.header',
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
    component: ProductUpdateComponent,
    data: {
      title: 'pages.product.create.header',
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
    component: ProductUpdateComponent,
    resolve: {
      row: ProductResolver,
    },
    data: {
      title: 'pages.product.update.header',
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
 * @class ProductRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ProductRoutingModule {}
