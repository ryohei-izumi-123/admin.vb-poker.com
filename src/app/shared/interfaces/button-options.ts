import { IIconOptions } from '@shared/interfaces/icon-options';
import { TButtonType, TPosition } from '@shared/types';
export interface IButtonOptions {
  type?: TButtonType;
  clazz?: string;
  icon?: IIconOptions;
}
export interface IButtonsOptions extends IButtonOptions {
  disabled?: boolean;
  click?: () => any;
  text?: string;
  inMenu?: boolean;
}

export interface IButtonGroupOptions {
  position: TPosition;
  clazz: string;
  buttons: IButtonsOptions[];
}

export interface IBackButtonOptions extends IButtonOptions {
  position?: TPosition;
}
