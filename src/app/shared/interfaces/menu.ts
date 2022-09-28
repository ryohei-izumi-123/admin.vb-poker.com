/**
 *
 *
 * @export
 * @interface IMenu
 */
export interface IMenu {
  path?: string;
  icon?: string;
  text: string;
  children?: IMenu[];
}
