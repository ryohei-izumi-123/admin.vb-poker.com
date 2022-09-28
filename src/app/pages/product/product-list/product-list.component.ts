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
import { IProduct } from '@shared/interfaces';
import { CsvService, ProductService } from '@shared/services';
import { ProductStatusComponent } from '@pages/product/product-status/product-status.component';
import { BaseListComponent } from '@core/class/base-list.component';

/**
 *
 *
 * @export
 * @class ProductListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent
  extends BaseListComponent<IProduct, ProductService, ProductStatusComponent>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Creates an instance of ProductListComponent.
   * @param {TranslateService} _translateSvc
   * @param {ProductService} _productSvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof ProductListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _productSvc: ProductService,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _productSvc, _csvSvc, _router, _changeDetectorRef);
  }

  /**
   *
   * @returns {IProduct[]}
   * @memberof ProductListComponent
   */
  public exportAsCsv(): IProduct[] {
    const filename: string = `download-${this.pageName}`;
    const data: IProduct[] = _.cloneDeep(this.rows).map((row: IProduct) => {
      return {
        id: row.id,
        name: row.name,
        categoryName: row.category.name,
        price: row.price,
        remarks: row.remarks,
        status: row.status,
      };
    });

    return this._csvSvc.generate<IProduct>(data, filename);
  }
}
