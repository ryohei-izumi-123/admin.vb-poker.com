import { Inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TRole } from '@shared/types/role';

/**
 *
 *
 * @export
 * @class RolePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'role',
})
export class RolePipe implements PipeTransform {
  /**
   *Creates an instance of RolePipe.
   * @param {TranslateService} _translateSvc
   * @memberof RolePipe
   */
  public constructor(
    @Inject(TranslateService) private _translateSvc: TranslateService
  ) {}

  /**
   *
   *
   * @param {TRole} value
   * @param {string} [args]
   * @returns {string}
   * @memberof RolePipe
   */
  public transform(value: TRole, args?: string): string {
    let label: string = '';
    const prefix: string = 'common.roles.';
    switch (value) {
      case 'administrator':
      case 'head_office':
      case 'manager':
      case 'master_agent':
      case 'operator':
      case 'agent':
      case 'na':
        label = this._translateSvc.instant(`${prefix}${value}`);
        break;

      default:
        label = this._translateSvc.instant('common.roles.unknown');
        break;
    }

    if ('label' === args) {
      switch (value) {
        case 'administrator':
        case 'head_office':
          label = 'label label-success';
          break;
        case 'manager':
        case 'master_agent':
          label = 'label label-danger';
          break;
        case 'operator':
        case 'agent':
          label = 'label label-warning';
          break;
        default:
        case 'na':
          label = 'label label-info';
          break;
      }
    }

    if ('color' === args) {
      switch (value) {
        case 'administrator':
        case 'head_office':
          label = 'primary';
          break;
        case 'manager':
        case 'master_agent':
          label = 'warn';
          break;
        case 'operator':
        case 'agent':
          label = 'accent';
          break;
        default:
        case 'na':
          label = '';
          break;
      }
    }
    if ('icon' === args) {
      switch (value) {
        case 'administrator':
        case 'head_office':
          label = 'administrator';
          break;
        case 'manager':
        case 'master_agent':
          label = 'assign-user';
          break;
        case 'operator':
        case 'agent':
          label = 'user';
          break;
        default:
        case 'na':
          label = 'users';
          break;
      }
    }
    return label;
  }
}
