import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { _ } from '@core/class/util';
import { Observable, EMPTY as EMPTY$ } from 'rxjs';
import { take } from 'rxjs/operators';
import { BaseRestService } from '@core/class/base-rest.service';
import { ApiService } from '@shared/services/api.service';
import {
  IAcl,
  IAclCrud,
  IAclPermission,
  IAclRolePermission,
} from '@shared/interfaces';
import { TRole } from '@shared/types/role';
import { TAclAction } from '@shared/types/acl';

/**
 *
 *
 * @export
 * @class AclService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class AclService extends BaseRestService<IAcl> implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof AclService
   */
  public endpoint: string = 'acls';

  /**
   *Creates an instance of AclService.
   * @param {ApiService} _apiSvc
   * @memberof AclService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }

  /**
   *
   *
   * @param {TRole} role
   * @return {Observable<IAcl>}
   * @memberof AclService
   */
  public getByRole$(role: TRole): Observable<IAcl> {
    if (!role) {
      return EMPTY$;
    }

    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/${role}`;
    return this._apiSvc.get<IAcl>(url).pipe(take(1));
  }

  /**
   *
   *
   * @private
   * @param {string} segment
   * @return {TAclAction}
   * @memberof AclService
   */
  private _convertToAction(segment: string): TAclAction {
    let action: TAclAction;
    switch (_.toLower(segment)) {
      case 'create':
      case 'delete':
      case 'update':
        action = segment as TAclAction;
        break;

      default:
      case 'index':
      case 'detail':
        action = 'read';
        break;
    }

    return action;
  }

  /**
   *
   *
   * @param {string} resource
   * @return {string}
   * @memberof AclService
   */
  private _cleanResource(resource: string): string {
    const slash: string = '/';
    return _.toString(resource).replace(slash, '');
  }

  /**
   *
   *
   * @param {IAcl} acl
   * @param {string} url
   * @return {boolean}
   * @memberof AclService
   */
  public checkPermissionByUrl(acl: IAcl, url: string): boolean {
    const slash: string = '/';
    const segments: string[] = url.split(slash);
    const [$0, $1 = '']: string[] = segments.filter(
      (k: string) => !_.isEmpty(k)
    );

    return this.hasPermission(acl, $0, this._convertToAction($1));
  }

  /**
   *
   *
   * @param {IAcl} acl
   * @param {string} resource
   * @param {TAclAction} action
   * @return {boolean}
   * @memberof AclService
   */
  public hasPermission(
    acl: IAcl,
    resource: string,
    action: TAclAction
  ): boolean {
    resource = this._cleanResource(resource);
    const permission: IAclPermission = acl.permissions.find(
      (p: IAclPermission) => _.get(p, 'resource') === resource
    );
    if (_.isUndefined(permission)) {
      return false;
    }

    const crud: IAclCrud = permission.crud.find(
      (c: IAclCrud) => _.get(c, 'action') === action
    );
    if (_.isUndefined(crud)) {
      return false;
    }

    return _.get(crud, 'value') || false;
  }

  /**
   *
   *
   * @param {IAcl[]} rows
   * @return {Observable<IAcl[]>}
   * @memberof AclService
   */
  public updateAll$(rows: IAcl[]): Observable<IAcl[]> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}`;
    return this._apiSvc.patch<IAcl[]>(url, rows).pipe(take(1));
  }
}
