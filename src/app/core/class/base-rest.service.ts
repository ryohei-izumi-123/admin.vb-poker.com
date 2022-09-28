import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
// import { HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY as EMPTY$ } from 'rxjs';
import { take, map, distinctUntilChanged, retry } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { ApiService } from '@shared/services/api.service';
import { IEntity, IPaginate, IPageable } from '@shared/interfaces';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @abstract
 * @class BaseRestService
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: null,
})
export abstract class BaseRestService<T extends IEntity>
  extends BaseService
  implements OnDestroy {
  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof BaseRestService
   */
  protected abstract endpoint: string;

  /**
   *
   *
   * @protected
   * @type {BehaviorSubject<T[]>}
   * @memberof BaseRestService
   */
  protected _dataSubject: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);

  /**
   *
   *
   * @type {Observable<T[]>}
   * @memberof BaseRestService
   */
  public data$: Observable<T[]> = this._dataSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {T[]}
   * @memberof BaseRestService
   */
  public get data(): T[] {
    return this._dataSubject.getValue();
  }

  /**
   *
   *
   * @param {T[]} data
   * @returns {void}
   * @memberof BaseRestService
   */
  public set data(data: T[]) {
    this._dataSubject.next(data);
  }

  /**
   *Creates an instance of BaseRestService.
   * @param {ApiService} _apiSvc
   * @memberof BaseRestService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super();
  }

  /**
   *
   *
   * @protected
   * @memberof BaseRestService
   */
  protected init(): void {}

  /**
   *
   *
   * @memberof BaseRestService
   */
  public ngOnDestroy() {
    this._dataSubject.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @template T
   * @return {Observable<T[]>}
   * @memberof BaseRestService
   */
  public getAll$(): Observable<T[]> {
    return this.fetchAll$().pipe(
      map((response: IPageable<T>) => response.rows),
      take(1)
    );
  }

  /**
   *
   *
   * @template T
   * @param {IPaginate<T>} [payload]
   * @return {Observable<IPageable<T>>}
   * @memberof BaseRestService
   */
  public fetchAll$(payload?: IPaginate<T>): Observable<IPageable<T>> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}`;
    return this._apiSvc
      .get<IPageable<T>>(url, this._apiSvc.serializeParam(payload))
      .pipe(retry(1), take(1));
  }

  /**
   *
   *
   * @template T
   * @param {number} id
   * @return {Observable<T>}
   * @memberof BaseRestService
   */
  public getById$(id: number): Observable<T> {
    if (!id) {
      return EMPTY$;
    }

    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/${id}`;
    return this._apiSvc.get<T>(url).pipe(retry(1), take(1));
  }

  /**
   *
   *
   * @template T
   * @param {T} row
   * @return {Observable<T>}
   * @memberof BaseRestService
   */
  public getOne$(row: T): Observable<T> {
    return this.getById$(row.id);
  }

  /**
   *
   *
   * @template T
   * @param {T} payload
   * @return {Observable<T>}
   * @memberof BaseRestService
   */
  public create$(payload: T): Observable<T> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}`;
    return this._apiSvc.post<T>(url, payload).pipe(take(1));
  }

  /**
   *
   *
   * @template T
   * @param {T} row
   * @return {Observable<T>}
   * @memberof BaseRestService
   */
  public update$(row: T): Observable<T> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/${row.id}`;
    return this._apiSvc.patch<T>(url, row).pipe(take(1));
  }

  /**
   *
   *
   * @template T
   * @param {T} row
   * @return {Observable<T>}
   * @memberof BaseRestService
   */
  public delete$(row: T): Observable<T> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/${row.id}`;
    return this._apiSvc.delete<T>(url).pipe(take(1));
  }

  /**
   *
   *
   * @template T
   * @param {T} row
   * @return {Observable<T>}
   * @memberof BaseRestService
   */
  public status$(row: T): Observable<T> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/${row.id}/status`;
    return this._apiSvc.patch<T>(url, row).pipe(take(1));
  }

  /**
   *
   *
   * @template T
   * @param {T} row
   * @return {Observable<T>}
   * @memberof BaseRestService
   */
  public password$(row: T): Observable<T> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}/${row.id}/password`;
    return this._apiSvc.patch<T>(url, row).pipe(take(1));
  }
}
