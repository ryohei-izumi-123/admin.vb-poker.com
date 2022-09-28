import { IIconOptions } from '@shared/interfaces/icon-options';
import { TPosition, TTooltipSize } from '@shared/types';
export interface ITooltipIconOptions {
  clazz?: string;
  size?: TTooltipSize;
  icon?: IIconOptions;
  position?: TPosition;
}
