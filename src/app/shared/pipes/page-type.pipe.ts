import { Inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TPageType } from '@shared/types/page-type';

/**
 *
 *
 * @export
 * @class PageTypePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'pageType',
})
export class PageTypePipe implements PipeTransform {
  /**
   *Creates an instance of PageTypePipe.
   * @param {TranslateService} _translateSvc
   * @memberof PageTypePipe
   */
  public constructor(
    @Inject(TranslateService) private _translateSvc: TranslateService
  ) {}

  /**
   *
   *
   * @param {TPageType} value
   * @param {string} [args]
   * @returns {string}
   * @memberof PageTypePipe
   */
  public transform(value: TPageType, args?: string): string {
    let label: string = '';
    const prefix: string = 'common.pageTypes.';
    switch (value) {
      case 'about':
      case 'service':
      case 'faq':
        label = this._translateSvc.instant(`${prefix}${value}`);
        break;

      case 'free':
      default:
        label = this._translateSvc.instant(`${prefix}unknown`);
        break;
    }

    if ('label' === args) {
      switch (value) {
        case 'about':
          label = 'label label-success';
          break;
        case 'service':
          label = 'label label-danger';
          break;
        case 'faq':
          label = 'label label-warning';
          break;
        case 'free':
        default:
          label = 'label label-info';
          break;
      }
    }

    if ('color' === args) {
      switch (value) {
        case 'about':
          label = 'primary';
          break;
        case 'service':
          label = 'warn';
          break;
        case 'faq':
          label = 'accent';
          break;
        case 'free':
        default:
          label = '';
          break;
      }
    }
    if ('icon' === args) {
      switch (value) {
        case 'about':
          label = 'check';
          break;
        case 'service':
          label = 'lock';
          break;
        case 'faq':
          label = 'warning';
          break;
        case 'free':
        default:
          label = '';
          break;
      }
    }
    return label;
  }
}
