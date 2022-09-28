import { TIso3166A2, TIso3166A3, TCallPrefix } from '@shared/types';
import { IEntity } from './entity';

/**
 *
 *
 * @export
 * @interface ICountry
 */
export interface ICountry extends IEntity {
  name: string;
  iso3166A2: TIso3166A2;
  iso3166A3: TIso3166A3;
  callPrefix: TCallPrefix;
}
