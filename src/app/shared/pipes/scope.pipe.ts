import { Inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TScope } from '@shared/types/scope';

/**
 *
 *
 * @export
 * @class ScopePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'scope',
})
export class ScopePipe implements PipeTransform {
  /**
   *Creates an instance of ScopePipe.
   * @param {TranslateService} _translateSvc
   * @memberof ScopePipe
   */
  public constructor(
    @Inject(TranslateService) private _translateSvc: TranslateService
  ) {}

  /**
   *
   *
   * @param {TScope} value
   * @param {string} [args]
   * @returns {string}
   * @memberof ScopePipe
   */
  public transform(value: TScope, args?: string): string {
    let label: string = '';
    const prefix: string = 'common.scopes.';
    switch (value) {
      case 'private':
      case 'public':
        label = this._translateSvc.instant(`${prefix}${value}`);
        break;

      default:
        label = this._translateSvc.instant(`${prefix}unknown`);
        break;
    }

    if ('label' === args) {
      switch (value) {
        case 'private':
          label = 'label label-success';
          break;
        case 'public':
          label = 'label label-danger';
          break;

        default:
          label = 'label label-info';
          break;
      }
    }

    if ('color' === args) {
      switch (value) {
        case 'private':
          label = 'primary';
          break;
        case 'public':
          label = 'accent';
          break;

        default:
          label = '';
          break;
      }
    }
    if ('icon' === args) {
      switch (value) {
        case 'private':
          label = 'check';
          break;
        case 'public':
          label = 'lock';
          break;

        default:
          label = '';
          break;
      }
    }
    return label;
  }
}
