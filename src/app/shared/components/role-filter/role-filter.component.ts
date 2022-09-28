import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { map, skipWhile, take } from 'rxjs/operators';
import { ClrDatagridFilterInterface, ClrDatagridFilter } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '@core/class/util';
import { BaseFilterComponent } from '@core/class/base-filter.component';
import { AuthService } from '@shared/services/auth.service';
import { IEntity, IUser } from '@shared/interfaces';
import { TRole } from '@shared/types';
import { ERole } from '@shared/enum';

/**
 *
 * @description Datagridのフィルター用のコンポーネント。フィルターのインターフェイスを保持するため、 `property`, `value`の項目が必要。
 * @export
 * @class RoleFilterComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-role-filter',
  templateUrl: './role-filter.component.html',
  styleUrls: ['./role-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleFilterComponent
  extends BaseFilterComponent<TRole>
  implements OnInit, OnDestroy, ClrDatagridFilterInterface<IEntity> {
  /**
   * Creates an instance of RoleFilterComponent.
   * @param {AuthService} _authSvc
   * @param {ClrDatagridFilter} _clrDatagridFilter
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof RoleFilterComponent
   */
  public constructor(
    private _authSvc: AuthService,
    protected _clrDatagridFilter: ClrDatagridFilter,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_clrDatagridFilter, _translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof RoleFilterComponent
   */
  public ngOnInit() {
    this.property = 'role';
    switch (this.pageName) {
      case 'user':
        this.options = ['administrator', 'manager', 'operator'];
        this.filterOptions();
        break;

      case 'customer':
        this.options = ['head_office', 'master_agent', 'agent', 'na'];
        break;

      default:
        break;
    }

    super.ngOnInit();
  }

  /**
   *
   * @description ログイン権限より上の権限を選択肢から除外する。
   * @private
   * @memberof RoleFilterComponent
   */
  private filterOptions(): Subscription {
    return this._subscription.add(
      this._authSvc.user$
        .pipe(
          skipWhile((user: IUser) => _.isEmpty(user)),
          map((user: IUser) => _.get(user, 'role')),
          take(1)
        )
        .subscribe((role: TRole) => {
          this.options = this.options.filter(
            (option: TRole) => this.toNumber(option) >= this.toNumber(role)
          );
        })
    );
  }

  /**
   *
   * @description roleの文字列を数値で比較する。値が小さいほど権限が大きい。自分より上の権限は見れない。
   * @private
   * @param {TRole} role
   * @return {number}
   * @memberof RoleFilterComponent
   */
  private toNumber(role: TRole): number {
    return ERole[_.toUpper(role)];
  }

  /**
   *
   *
   * @memberof RoleFilterComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      role: new FormControl(null),
    });
  }

  /**
   *
   *
   * @param {TRole} value
   * @memberof RoleFilterComponent
   */
  public onChange(value: TRole): void {
    this.isSelected(value) ? this.removeValue(value) : this.addValue(value);
    this.active = !_.isEmpty(this.values);
  }
}
