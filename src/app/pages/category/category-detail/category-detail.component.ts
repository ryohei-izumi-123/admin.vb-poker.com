import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ICategory } from '@shared/interfaces';
import { CategoryService } from '@shared/services';
import { BaseDetailComponent } from '@core/class/base-detail.component';

/**
 *
 *
 * @export
 * @class CategoryDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailComponent
  extends BaseDetailComponent<ICategory, CategoryService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of CategoryDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {CategoryService} _categorySvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CategoryDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _categorySvc: CategoryService,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _categorySvc, _router, _route, _changeDetectorRef);
  }
}
