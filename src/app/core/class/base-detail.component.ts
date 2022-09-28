import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, NEVER as NEVER$, throwError as throwError$ } from 'rxjs';
import {
  map,
  filter,
  tap,
  catchError,
  take,
  distinctUntilChanged,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { IEntity, IDgRouteDataRow } from '@shared/interfaces';
import { TRowDataSource } from '@shared/types';
import { BaseRestService } from '@core/class/base-rest.service';
import { BaseComponent } from '@core/class/base.component';

/**
 *
 *
 * @export
 * @class BaseDetailComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-detail',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseDetailComponent<
    T extends IEntity,
    P extends BaseRestService<T>
  >
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @protected
   * @type {T}
   * @memberof BaseDetailComponent
   */
  protected _row: T = null;

  /**
   *
   *
   * @type {T}
   * @memberof BaseDetailComponent
   */
  public get row(): T {
    return this._row;
  }

  /**
   *
   *
   * @memberof BaseDetailComponent
   */
  @Input()
  public set row(row: T) {
    this._row = row;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @returns {TRowDataSource<Partial<T>>}
   * @memberof BaseDetailComponent
   */
  protected dataSource$(): TRowDataSource<Partial<T>> {
    return this._restSvc.getOne$.bind(this._restSvc);
  }

  /**
   * Creates an instance of BaseDetailComponent.
   * @param {TranslateService} _translateSvc
   * @param {BaseRestService<T>} _restSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseDetailComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _restSvc: BaseRestService<T>,
    protected _router: Router,
    protected _route: ActivatedRoute,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof BaseDetailComponent
   */
  public ngOnInit() {
    if (this.hasRouteParamsId) {
      this._subscription.add(this.fromRouteData$().subscribe());
    }
  }

  /**
   *
   *
   * @memberof BaseDetailComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof BaseDetailComponent
   */
  public ngOnChanges(changes: SimpleChanges) {
    this._subscription.add(this.fromInput$(changes).subscribe());
  }

  /**
   *
   *
   * @protected
   * @param {T} payload
   * @returns {Observable<T>}
   * @memberof BaseDetailComponent
   */
  protected fetchRow$(payload: T): Observable<T> {
    const dataSource$: TRowDataSource<Partial<T>> = this.dataSource$();

    return dataSource$(payload).pipe(
      filter((row: T) => !!!_.isEmpty(row)),
      tap((row: T) => (this.row = row)),
      catchError(() =>
        throwError$(new Error(this.translate('errors.unknownError')))
      )
    );
  }

  /**
   *
   *
   * @returns {Observable<T>}
   * @memberof BaseDetailComponent
   */
  protected fromRouteData$(): Observable<T> {
    return this._route.data.pipe(
      map((data: IDgRouteDataRow<T>) => _.get(data, 'row')),
      filter((row: T) => !!!_.isEmpty(row)),
      tap((row: T) => (this.row = row)),
      distinctUntilChanged()
    );
  }

  /**
   *
   *
   * @protected
   * @param {SimpleChanges} changes
   * @returns {Observable<T>}
   * @memberof BaseDetailComponent
   */
  protected fromInput$(changes: SimpleChanges): Observable<T> {
    const change: SimpleChange = _.get(changes, 'row');
    const row: T = change.currentValue as T;
    if (_.isEmpty(row)) {
      return NEVER$;
    }

    return this.fetchRow$(row).pipe(take(1));
  }

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof BaseDetailComponent
   */
  public get routeParamsId(): number {
    const id: number = _.get(this._route, 'snapshot.params.id');
    return _.isEmpty(id) ? undefined : _.toNumber(id);
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseDetailComponent
   */
  public get hasRouteParamsId(): boolean {
    return _.isNumber(this.routeParamsId);
  }

  /**
   *
   *
   * @param {string} [type='header']
   * @param {string} [action='detail']
   * @param {*} [params=this.row]
   * @return {string}
   * @memberof BaseDetailComponent
   */
  public getPageText(
    type: string = 'header',
    action: string = 'detail',
    params: any = this.row
  ): string {
    return super.getPageText(type, action, params);
  }
}
