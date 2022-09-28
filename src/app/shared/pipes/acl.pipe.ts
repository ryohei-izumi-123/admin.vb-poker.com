import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { IAcl, IUser } from '@shared/interfaces';
import { TAclAction } from '@shared/types';
import { AuthService } from '@shared/services/auth.service';
import { AclService } from '@shared/services/acl.service';

/**
 *
 *
 * @export
 * @class AclPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'acl',
})
export class AclPipe implements PipeTransform {
  /**
   * Creates an instance of AclPipe.
   * @param {AuthService} _authSvc
   * @param {AclService} _aclSvc
   * @memberof AclPipe
   */
  public constructor(
    @Inject(AuthService) private _authSvc: AuthService,
    @Inject(AclService) private _aclSvc: AclService
  ) {}

  /**
   *
   *
   * @param {string} resource
   * @param {TAclAction} [action='read']
   * @return {Observable<boolean>}
   * @memberof AclPipe
   */
  public transform(
    resource: string,
    action: TAclAction = 'read'
  ): Observable<boolean> {
    return this._authSvc.user$.pipe(
      map((user: IUser) => _.get(user, 'acl')),
      map((acl: IAcl) => this._aclSvc.hasPermission(acl, resource, action)),
      take(1)
    );
  }
}
