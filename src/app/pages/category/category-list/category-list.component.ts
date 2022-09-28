import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { ICategory } from '@shared/interfaces';
import { CsvService, CategoryService } from '@shared/services';
import { CategoryStatusComponent } from '@pages/category/category-status/category-status.component';
import { BaseListComponent } from '@core/class/base-list.component';

/**
 *
 *
 * @export
 * @class CategoryListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent
  extends BaseListComponent<ICategory, CategoryService, CategoryStatusComponent>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of CategoryListComponent.
   * @param {TranslateService} _translateSvc
   * @param {CategoryService} _categorySvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CategoryListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _categorySvc: CategoryService,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _categorySvc, _csvSvc, _router, _changeDetectorRef);
  }

  /**
   *
   * @returns {ICategory[]}
   * @memberof CategoryListComponent
   */
  public exportAsCsv(): ICategory[] {
    const filename: string = `download-${this.pageName}`;
    const data: ICategory[] = _.cloneDeep(this.rows).map((row: ICategory) => {
      return {
        id: row.id,
        name: row.name,
        status: row.status,
      };
    });

    return this._csvSvc.generate<ICategory>(data, filename);
  }
}
