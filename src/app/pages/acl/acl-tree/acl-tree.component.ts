import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { NEVER as NEVER$, Subscription } from 'rxjs';
import { take, catchError, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { _ } from '@core/class/util';
import { BaseTreeComponent } from '@core/class/base-tree.component';
import { IAcl } from '@shared/interfaces';
import { AclService, ToasterService } from '@shared/services';
import { ModalComponent } from '@shared/components/modal/modal.component';

/**
 *
 *
 * @export
 * @class AclTreeComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-acl-tree',
  templateUrl: './acl-tree.component.html',
  styleUrls: ['./acl-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AclTreeComponent
  extends BaseTreeComponent<IAcl, AclService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {ModalComponent}
   * @memberof AclTreeComponent
   */
  @ViewChild('$modal')
  public $modal: ModalComponent;

  /**
   * Creates an instance of AclTreeComponent.
   * @param {ToasterService} _toasterSvc
   * @param {TranslateService} _translateSvc
   * @param {AclService} _aclSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof AclTreeComponent
   */
  public constructor(
    protected _toasterSvc: ToasterService,
    protected _translateSvc: TranslateService,
    protected _aclSvc: AclService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _aclSvc, _router, _route, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof AclTreeComponent
   */
  public initForm(): void {
    this.form = new FormGroup({});
  }

  /**
   *
   *
   * @returns {Subscription}
   * @memberof AclTreeComponent
   */
  public onSubmit(): Subscription {
    const payload: IAcl[] = this.nodes;
    const isValid: boolean = this.form.valid;
    const isBusy: boolean = this.isBusy;
    if (!isValid || isBusy) {
      return this._subscription.add(NEVER$.subscribe());
    }

    this.isBusy = true;
    this.error = null;
    this.$submit.setLoading();

    return this._subscription.add(
      this._aclSvc
        .updateAll$(payload)
        .pipe(
          finalize(() => (this.isBusy = false)),
          catchError((error: Error) => {
            this.error = new Error(this.translate('errors.updateFailed'));
            this.$submit.setError();

            return NEVER$;
          }),
          take(1)
        )
        .subscribe((nodes: IAcl[]) => {
          this._toasterSvc.show({
            type: 'success',
            message: this.translate('errors.updateSuccess'),
          });
          this.$submit.setDefault();
          this.nodes = nodes;
          this.$modal.close();
        })
    );
  }

  /**
   *
   *
   * @param {IAcl} node
   * @return {boolean}
   * @memberof AclTreeComponent
   */
  public isAdministrator(node: IAcl): boolean {
    return _.get(node, 'role') === 'administrator';
  }

  /**
   *
   *
   * @param {IAcl} node
   * @return {string}
   * @memberof AclTreeComponent
   */
  public notAllowedWhenAdministrator(node: IAcl): string {
    return this.isAdministrator(node) ? 'cursor-notallowed' : '';
  }
}
