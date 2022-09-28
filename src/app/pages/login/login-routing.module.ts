import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'index',
  },
  {
    path: 'index',
    pathMatch: 'full',
    component: LoginComponent,
    data: {
      title: 'pages.login.index.header',
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
 * @class LoginRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class LoginRoutingModule {}
