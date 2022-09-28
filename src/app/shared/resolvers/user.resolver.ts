import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { IUser } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class UserResolver
 * @extends {BaseEntityResolver<IUser, UserService>}
 * @implements {Resolve<IUser>}
 */
@Injectable({
  providedIn: 'root',
})
export class UserResolver
  extends BaseEntityResolver<IUser, UserService>
  implements Resolve<IUser> {
  /**
   *Creates an instance of UserResolver.
   * @param {UserService} _userSvc
   * @param {Router} _router
   * @memberof UserResolver
   */
  public constructor(
    protected _userSvc: UserService,
    protected _router: Router
  ) {
    super(_userSvc, _router);
  }
}
