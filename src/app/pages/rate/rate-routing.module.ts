import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AclGuard } from '@shared/guards';
import { RateResolver } from '@shared/resolvers';
import { RateComponent } from './rate.component';
// import { RateListComponent } from './rate-list/rate-list.component';
// import { RateUpdateComponent } from './rate-update/rate-update.component';
// import { RateDetailComponent } from './rate-detail/rate-detail.component';
// import { RateDeleteComponent } from './rate-delete/rate-delete.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: RateComponent,
    data: {
      title: 'pages.rate.index.header',
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
    // children: [
    //   {
    //     path: '',
    //     pathMatch: 'full',
    //     component: RateListComponent,
    //     outlet: 'page',
    //   },
    // ],
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
 * @class RateRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class RateRoutingModule {}
