import { Inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TStatus } from '@shared/types/status';

/**
 *
 *
 * @export
 * @class StatusPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  /**
   *Creates an instance of StatusPipe.
   * @param {TranslateService} _translateSvc
   * @memberof StatusPipe
   */
  public constructor(
    @Inject(TranslateService) private _translateSvc: TranslateService
  ) {}

  /**
   *
   *
   * @param {TStatus} value
   * @param {string} [args]
   * @returns {string}
   * @memberof StatusPipe
   */
  public transform(value: TStatus, args?: string): string {
    let label: string = '';
    const prefix: string = 'common.statuses.';
    switch (value) {
      case 'active':
      case 'inactive':
      case 'pending':
        label = this._translateSvc.instant(`${prefix}${value}`);
        break;

      default:
        label = this._translateSvc.instant(`${prefix}unknown`);
        break;
    }

    if ('label' === args) {
      switch (value) {
        case 'active':
          label = 'label label-success';
          break;
        case 'inactive':
          label = 'label label-danger';
          break;
        case 'pending':
          label = 'label label-warning';
          break;
        default:
          label = 'label label-info';
          break;
      }
    }

    if ('color' === args) {
      switch (value) {
        case 'active':
          label = 'primary';
          break;
        case 'inactive':
          label = 'warn';
          break;
        case 'pending':
          label = 'accent';
          break;
        default:
          label = '';
          break;
      }
    }
    if ('icon' === args) {
      switch (value) {
        case 'active':
          label = 'check';
          break;
        case 'inactive':
          label = 'lock';
          break;
        case 'pending':
          label = 'warning';
          break;
        default:
          label = '';
          break;
      }
    }
    return label;
  }
}
