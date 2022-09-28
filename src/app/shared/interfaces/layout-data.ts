import { Data as RouteData } from '@angular/router';
import { THeaderStyle } from '@shared/types/header-style';
export interface ILayoutData extends RouteData {
  title: string;
  header: boolean;
  footer: boolean;
  subnav: boolean;
  sidenav: boolean;
  appLevelAlert?: boolean;
  showHeaderSpan: boolean;
  headerStyle: THeaderStyle;
  wrapperClass: 'page-wrapper' | string;
  containerStyle: 'content-container';
  contentAreaStyle: 'content-area';
}
