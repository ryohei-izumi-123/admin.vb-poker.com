import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from '@pages/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: LogoutComponent,
    data: {
      title: 'pages.logout.index.header',
      header: false,
      sidenav: false,
      subnav: false,
      footer: false,
      showHeaderSpan: false,
      headerStyle: '',
      wrapperClass: '',
      containerStyle: '',
      contentAreaStyle: '',
    },
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
 * @class LogoutRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class LogoutRoutingModule {}
