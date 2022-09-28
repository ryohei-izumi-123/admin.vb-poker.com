import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { OrderResolver } from '@shared/resolvers';
import { OrderComponent } from './order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderUpdateComponent } from './order-update/order-update.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderDeleteComponent } from './order-delete/order-delete.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: OrderComponent,
    data: {
      title: 'pages.order.index.header',
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
        component: OrderListComponent,
        outlet: 'page',
      },
    ],
    canActivate: [AuthGuard, AclGuard],
  },
  {
    path: 'delete/:id',
    pathMatch: 'prefix',
    component: OrderDeleteComponent,
    resolve: {
      row: OrderResolver,
    },
    data: {
      title: 'pages.order.delete.header',
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
    component: OrderDetailComponent,
    resolve: {
      row: OrderResolver,
    },
    data: {
      title: 'pages.order.detail.header',
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
  // should not create order as new one
  // {
  //   path: 'create',
  //   pathMatch: 'prefix',
  //   component: OrderUpdateComponent,
  //   data: {
  //     title: 'pages.order.create.header',
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
    component: OrderUpdateComponent,
    resolve: {
      row: OrderResolver,
    },
    data: {
      title: 'pages.order.update.header',
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
 * @class OrderRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class OrderRoutingModule {}
