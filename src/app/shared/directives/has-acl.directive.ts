import {
  Directive,
  OnInit,
  OnDestroy,
  OnChanges,
  ChangeDetectorRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  Inject,
} from '@angular/core';
import { take, map, skipWhile } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { BaseIfDirective } from '@core/class/base-if.directive';
import { AclService } from '@shared/services/acl.service';
import { IAcl, IAclRolePermission, IUser } from '@shared/interfaces';
import { TAclAction } from '@shared/types';
import { AuthService } from '@shared/services/auth.service';

/**
 *
 *
 * @export
 * @description `*ngIf="('category'|acl:'delete')|async"` と同じ動作をする。
 * @example `<div *ngHasAcl="{ resource: 'category', action: 'read' }">Only shown when user has category[:read] acl.</div>`
 * @class HasAclDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[ngHasAcl], [ngHasAclElse]',
})
export class HasAclDirective
  extends BaseIfDirective
  implements OnInit, OnDestroy, OnChanges {
  /**
   * Creates an instance of HasAclDirective.
   * @param {AuthService} _authSvc
   * @param {AclService} _aclSvc
   * @param {TemplateRef<any>} _templateRef
   * @param {ViewContainerRef} _viewContainerRef
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof HasAclDirective
   */
  public constructor(
    @Inject(AuthService) private _authSvc: AuthService,
    @Inject(AclService) private _aclSvc: AclService,
    protected _templateRef: TemplateRef<any>,
    protected _viewContainerRef: ViewContainerRef,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_templateRef, _viewContainerRef, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof HasAclDirective
   */
  @Input()
  public set ngHasAclElse(elseTemplateRef: TemplateRef<any>) {
    this.elseTemplateRef = elseTemplateRef;
  }

  /**
   *
   *
   * @memberof HasAclDirective
   */
  @Input()
  public set ngHasAcl(param: IAclRolePermission) {
    const resource: string = _.get(param, 'resource');
    const action: TAclAction = _.get(param, 'action') || 'read';
    if (_.isUndefined(resource)) {
      this.condition = false;
      return;
    }

    this._subscription.add(
      this._authSvc.user$
        .pipe(
          skipWhile((user: IUser) => _.isEmpty(user)),
          map((user: IUser) => _.get(user, 'acl')),
          map((acl: IAcl) => this._aclSvc.hasPermission(acl, resource, action)),
          take(1)
        )
        .subscribe((visible: boolean) => (this.condition = visible))
    );
  }
}
