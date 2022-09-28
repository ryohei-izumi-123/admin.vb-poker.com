import { Inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TIso6391 } from '@shared/types/iso639-1';

/**
 *
 *
 * @export
 * @class LocalePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'locale',
})
export class LocalePipe implements PipeTransform {
  /**
   *Creates an instance of LocalePipe.
   * @param {TranslateService} _translateSvc
   * @memberof LocalePipe
   */
  public constructor(
    @Inject(TranslateService) private _translateSvc: TranslateService
  ) {}

  /**
   *
   *
   * @param {TIso6391} value
   * @param {string} [args]
   * @returns {string}
   * @memberof LocalePipe
   */
  public transform(value: TIso6391, args?: string): string {
    let label: string = '';
    const prefix: string = 'common.locales.';
    switch (value) {
      case 'en':
      case 'ja':
        label = this._translateSvc.instant(`${prefix}${value}`);
        break;

      default:
        label = this._translateSvc.instant(`${prefix}unknown`);
        break;
    }

    if ('label' === args) {
      switch (value) {
        case 'en':
          label = 'label label-success';
          break;
        case 'ja':
          label = 'label label-danger';
          break;
        default:
          label = 'label label-info';
          break;
      }
    }

    if ('color' === args) {
      switch (value) {
        case 'en':
          label = 'primary';
          break;
        case 'ja':
          label = 'warn';
          break;
        default:
          label = '';
          break;
      }
    }
    if ('img' === args) {
      switch (value) {
        case 'en':
        case 'ja':
          label = `/assets/img/${value}.svg`;
          break;

        default:
          label = '';
          break;
      }
    }
    return label;
  }
}
