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
import { map, tap } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { BaseIfDirective } from '@core/class/base-if.directive';
import { AuthService } from '@shared/services/auth.service';
import { IUser } from '@shared/interfaces';

/**
 *
 *
 * @export
 * @description　ログイン済みの場合のみ表示できる *ngIf="authSvc.isAuthenticated$"
 * @example `<div *ngIfAuth>Only shown when user logged</div>`
 * @example `<div *ngIfAuth="true; else $notLoggedIn">Only shown when user logged</div>`
 * @example `<div *ngIfAuth="let user">{{user?.username}}</div>`
 * @class IfAuthDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[ngIfAuth], [ngIfAuthElse]',
})
export class IfAuthDirective
  extends BaseIfDirective
  implements OnInit, OnDestroy, OnChanges {
  /**
   * Creates an instance of IfAuthDirective.
   * @param {AuthService} _authSvc
   * @param {TemplateRef<any>} _templateRef
   * @param {ViewContainerRef} _viewContainerRef
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof IfAuthDirective
   */
  public constructor(
    @Inject(AuthService) private _authSvc: AuthService,
    protected _templateRef: TemplateRef<any>,
    protected _viewContainerRef: ViewContainerRef,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_templateRef, _viewContainerRef, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof IfAuthDirective
   */
  public ngOnInit() {
    this._subscription.add(
      this._authSvc.user$
        .pipe(
          tap((user: IUser) => this._setContext(user)),
          map((user: IUser) => !_.isEmpty(user))
        )
        .subscribe((visible: boolean) => (this.condition = visible))
    );

    super.ngOnInit();
  }

  /**
   *
   *
   * @memberof IfAuthDirective
   */
  @Input()
  public set ngIfAuthElse(elseTemplateRef: TemplateRef<any>) {
    this.elseTemplateRef = elseTemplateRef;
  }

  /**
   *
   *
   * @memberof IfAuthDirective
   */
  @Input()
  public set ngIfAuth(param: any) {}

  /**
   *
   *
   * @private
   * @param {IUser} user
   * @memberof IfAuthDirective
   */
  private _setContext(user: IUser): void {
    this.context = {
      $implicit: user,
      ngIfAuth: user,
    };
    this._updateViewContainerRef();
  }
}
