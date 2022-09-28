import { TIconColor } from '@shared/types/icon';

/**
 *
 *
 * @export
 * @see https://clarity.design/foundation/icons/shapes/
 * @interface IIconOptions
 */
export interface IIconOptions {
  shape?: string | 'exclamation-circle';
  size?: number | 16;
  clazz?: TIconColor;
}
