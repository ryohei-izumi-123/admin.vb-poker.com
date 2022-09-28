import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { AclResolver } from '@shared/resolvers';
import { AclComponent } from './acl.component';
import { AclTreeComponent } from './acl-tree/acl-tree.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: AclComponent,
    data: {
      title: 'pages.acl.index.header',
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
        component: AclTreeComponent,
        outlet: 'page',
        resolve: {
          nodes: AclResolver,
        },
      },
    ],
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
 * @class AclRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AclRoutingModule {}
