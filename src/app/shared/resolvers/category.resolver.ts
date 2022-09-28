import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { CategoryService } from '@shared/services/category.service';
import { ICategory } from '@shared/interfaces';
import { BaseEntityResolver } from '@core/class/base-entity.resolver';

/**
 *
 *
 * @export
 * @class CategoryResolver
 * @extends {BaseEntityResolver<ICategory, CategoryService>}
 * @implements {Resolve<ICategory>}
 */
@Injectable({
  providedIn: 'root',
})
export class CategoryResolver
  extends BaseEntityResolver<ICategory, CategoryService>
  implements Resolve<ICategory> {
  /**
   *Creates an instance of CategoryResolver.
   * @param {CategoryService} _categorySvc
   * @param {Router} _router
   * @memberof CategoryResolver
   */
  public constructor(
    protected _categorySvc: CategoryService,
    protected _router: Router
  ) {
    super(_categorySvc, _router);
  }
}
