import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './error.component';

const routes: Routes = [
  {
    path: '**',
    pathMatch: 'full',
    component: ErrorComponent,
    data: {
      title: 'pages.error.index.header',
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
];

/**
 *
 *
 * @export
 * @class ErrorRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class ErrorRoutingModule {}
