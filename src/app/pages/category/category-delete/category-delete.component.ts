import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ICategory } from '@shared/interfaces';
import { CategoryService, ToasterService } from '@shared/services';
import { BaseDeleteComponent } from '@core/class/base-delete.component';

/**
 *
 *
 * @export
 * @class CategoryDeleteComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-category-delete',
  templateUrl: './category-delete.component.html',
  styleUrls: ['./category-delete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDeleteComponent
  extends BaseDeleteComponent<ICategory, CategoryService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of CategoryDeleteComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {CategoryService} _categorySvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CategoryDeleteComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
    protected _categorySvc: CategoryService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _toasterSvc,
      _categorySvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof CategoryDeleteComponent
   */
  public initForm(): void {
    this.form = new FormGroup({});
  }
}
