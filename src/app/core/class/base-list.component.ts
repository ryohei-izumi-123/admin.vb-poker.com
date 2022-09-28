import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  Inject,
} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  Observable,
  Subscription,
  EMPTY as EMPTY$,
  throwError as throwError$,
} from 'rxjs';
import { tap, catchError, take, finalize } from 'rxjs/operators';
import { _, Util } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { ClrDatagridStateInterface, ClrDatagrid } from '@clr/angular';
import {
  ITooltipIconOptions,
  IEntity,
  IDgFormValue,
  IDgMetadata,
  IDgOptions,
  IDgFilter,
  IDgFilterParam,
  // IDgFilterProp,
  IPageable,
  IPaginate,
} from '@shared/interfaces';
import {
  TSortOrder,
  TDgSort,
  TDgFilter,
  TRowsDataSource,
  TModalState,
  TDgFilterProp,
} from '@shared/types';
import { CsvService } from '@shared/services/csv.service';
import { BaseComponent } from '@core/class/base.component';
import { BaseStatusComponent } from '@core/class/base-status.component';
import { BaseRestService } from '@core/class/base-rest.service';
import { DatagridFormComponent } from '@shared/components/datagrid-form/datagrid-form.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
// import { NumericFilter } from '@app/core/filters/numeric';
// import { StringFilter } from '@core/filters/string';
// import { StatusComparator } from '@core/comparators/status';

/**
 *
 *
 * @export
 * @class BaseListComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-list',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseListComponent<
    T extends IEntity,
    P extends BaseRestService<T>,
    K extends BaseStatusComponent<T, P>
  >
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   * @deprecated
   * @type {StatusComparator}
   * @memberof BaseListComponent
   */
  // public statusComparator: StatusComparator = new StatusComparator();

  /**
   *
   * @deprecated
   * @type {StringFilter<T>}
   * @memberof BaseListComponent
   */
  // public stringFilter: StringFilter<T> = new StringFilter<T>();

  /**
   *
   * @deprecated
   * @type {NumericFilter<T>}
   * @memberof BaseListComponent
   */
  // public numericFilter: NumericFilter<T> = new NumericFilter<T>();

  /**
   *
   *
   * @type {ClrDatagrid}
   * @memberof BaseListComponent
   */
  @ViewChild('$datagrid')
  public $datagrid: ClrDatagrid;

  /**
   *
   *
   * @type {ModalComponent}
   * @memberof BaseListComponent
   */
  @ViewChild('$modal')
  public $modal: ModalComponent;

  /**
   *
   *
   * @type {K}
   * @memberof BaseListComponent
   */
  @ViewChild('$statusForm')
  public $statusForm: K;

  /**
   *
   *
   * @type {DatagridFormComponent}
   * @memberof BaseListComponent
   */
  @ViewChild('$form')
  public $form: DatagridFormComponent;

  /**
   *
   *
   * @type {T[]}
   * @memberof BaseListComponent
   */
  public get rows(): T[] {
    return this._restSvc.data;
  }

  /**
   *
   *
   * @memberof BaseListComponent
   */
  public set rows(rows: T[]) {
    this._restSvc.data = rows;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {boolean}
   * @memberof BaseListComponent
   */
  public get hasRows(): boolean {
    return _.isArray(this.rows) && _.size(this.rows) > 0;
  }

  /**
   *
   *
   * @protected
   * @type {TModalState}
   * @memberof BaseListComponent
   */
  protected _modalState: TModalState = null;

  /**
   *
   *
   * @type {TModalState}
   * @memberof BaseListComponent
   */
  public get modalState(): TModalState {
    return this._modalState;
  }

  /**
   *
   *
   * @memberof BaseListComponent
   */
  public set modalState(modalState: TModalState) {
    this._modalState = modalState;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {T}
   * @memberof BaseListComponent
   */
  protected _selected: T = null;

  /**
   *
   *
   * @type {T}
   * @memberof BaseListComponent
   */
  public get selected(): T {
    return this._selected;
  }

  /**
   *
   *
   * @memberof BaseListComponent
   */
  public set selected(row: T) {
    this._selected = row;
    this._changeDetectorRef.markForCheck();
    this._changeDetectorRef.detectChanges();
  }

  /**
   *
   *
   * @returns {TRowsDataSource<T>}
   * @memberof BaseListComponent
   */
  protected dataSource$(): TRowsDataSource<T> {
    return this._restSvc.fetchAll$.bind(this._restSvc);
  }

  /**
   *
   * @description Gridのパラメータ（コンポーネント側）
   * @protected
   * @type {IDgMetadata<T>}
   * @memberof BaseListComponent
   */
  protected _metadata: IDgMetadata<T> = {
    page: 1,
    pages: 0,
    total: 0,
    limit: 5,
    search: {
      query: null,
      createdAt: null,
    },
    filters: {},
  };

  /**
   *
   *
   * @readonly
   * @type {IDgMetadata<T>}
   * @memberof BaseListComponent
   */
  public set metadata(metadata: IDgMetadata<T>) {
    this._metadata = metadata;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IDgMetadata<T>}
   * @memberof BaseListComponent
   */
  public get metadata(): IDgMetadata<T> {
    return this._metadata;
  }

  /**
   *
   *
   * @protected
   * @type {IDgOptions}
   * @memberof BaseListComponent
   */
  protected _options: IDgOptions = {
    hasActionOverflow: true,
    hasExport: true,
    pageSizeOptions: [5, 10, 25, 50],
  };

  /**
   *
   *
   * @readonly
   * @type {IDgOptions}
   * @memberof BaseListComponent
   */
  public set options(options: IDgOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {IDgOptions}
   * @memberof BaseListComponent
   */
  public get options(): IDgOptions {
    return this._options;
  }

  /**
   *
   * @description Gridのパラメータ（ClrDatagrid側）
   * @protected
   * @type {ClrDatagridStateInterface}
   * @memberof BaseListComponent
   */
  protected _state: ClrDatagridStateInterface = null;

  /**
   *
   *
   * @readonly
   * @type {ClrDatagridStateInterface}
   * @memberof BaseListComponent
   */
  public set state(state: ClrDatagridStateInterface) {
    this._state = state;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @readonly
   * @type {ClrDatagridStateInterface}
   * @memberof BaseListComponent
   */
  public get state(): ClrDatagridStateInterface {
    return this._state;
  }

  /**
   *
   *
   * @type {{
   *     sort: TDgSort<T>,
   *     filter: TDgFilter<T>
   *   }}
   * @memberof BaseListComponent
   */
  public fields: {
    sort: TDgSort<T>;
    filter: TDgFilter<T>;
  } = null;

  /**
   * Creates an instance of BaseListComponent.
   * @param {TranslateService} _translateSvc
   * @param {BaseRestService} _restSvc
   * @param {CsvService} _csvSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseListComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    @Inject(BaseRestService) protected _restSvc: P,
    protected _csvSvc: CsvService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof BaseListComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @returns {TSortOrder}
   * @memberof BaseListComponent
   */
  public getSortOrder(): TSortOrder {
    const isReverse: boolean = _.get(this.state, 'sort.reverse') || false;
    return isReverse ? 'desc' : 'asc';
  }

  /**
   *
   *
   * @returns {keyof T}
   * @memberof BaseListComponent
   */
  public getSortBy<T>(): keyof T {
    const sort: keyof T = _.get(this.state, 'sort.by') || 'id';
    if (_.isString(sort) || sort === 'action') {
      return sort;
    }

    return 'id' as keyof T;
  }

  /**
   *
   * @description `ClrDatagridStateInterface`からGETメソッドで使える（REST API）queryパラメータに変換する。
   * @returns {IPaginate<T>}
   * @memberof BaseListComponent
   */
  protected mapState(): IPaginate<T> {
    const page: number =
      _.get(this.state, 'page.current') || this.metadata.page;
    const limit: number = _.get(this.state, 'page.size') || this.metadata.limit;
    const search: IDgFormValue = this.metadata.search || {};
    const filters: IDgFilterParam<T> = this.mapFilters();
    const order: TSortOrder = this.getSortOrder();
    const sort: keyof T = this.getSortBy() || 'id';

    return {
      search,
      filters,
      page,
      limit,
      order,
      sort,
    } as IPaginate<T>;
  }

  /**
   *
   *
   * @protected
   * @return {IDgFilterParam<T>}
   * @memberof BaseListComponent
   */
  protected mapFilters(): IDgFilterParam<T> {
    const filters: TDgFilterProp<T>[] = _.get(this.state, 'filters') || [];
    const filter: IDgFilter<T> = {};
    filters.map((prop: TDgFilterProp<T>) => {
      const property: string = _.get(prop, 'property') as string;
      const value: any = _.get(prop, 'value');
      if (!_.isEmpty(property) && !_.isEmpty(value)) {
        return _.set(filter, property, value);
      }
    });

    return filter;
  }

  /**
   *
   *
   * @return {Subscription}
   * @memberof BaseListComponent
   */
  public reload(): Subscription {
    if (this.isBusy) {
      return this._subscription.add(EMPTY$.subscribe());
    }

    this.selected = null;
    return this.onRefresh(_.cloneDeep(this.state));
  }

  /**
   *
   *
   * @param {ClrDatagridStateInterface} state
   * @returns {Subscription}
   * @memberof BaseListComponent
   */
  public onRefresh(state: ClrDatagridStateInterface): Subscription {
    this.state = state;
    this.metadata.page = _.get(this.state, 'page.current') || 1;
    this.metadata.limit = _.get(this.state, 'page.size') || this.metadata.limit;
    this.metadata.filters = this.mapFilters();

    return this._subscription.add(this.fetchRows$().pipe(take(1)).subscribe());
  }

  /**
   *
   *
   * @param {IPageable<T>} result
   * @memberof BaseListComponent
   */
  protected setRows(result: IPageable<T>): void {
    this.metadata.pages = result.paginate.pages;
    this.metadata.total = result.paginate.total;
    this.metadata.search = result.paginate.search;
    this.metadata.filters = result.paginate.filters;
    this.rows = result.rows;

    this._changeDetectorRef.detectChanges();
  }

  /**
   *
   * @description `isBusy`は　`clr-datagrid`のローディングとbindされているため、`detectChanges`を確実に呼び出す必要がある。従来の`markForCheck`だけでは正常に反映されない。
   * @param {boolean} isLoading
   * @memberof BaseListComponent
   */
  public setLoading(isLoading: boolean): void {
    this.isBusy = isLoading;
    this._changeDetectorRef.detectChanges();
  }

  /**
   *
   * @returns {Observable<IPageable<T>>>}
   * @memberof BaseListComponent
   */
  protected fetchRows$(): Observable<IPageable<T>> {
    this.setLoading(true);
    const payload: IPaginate<T> = this.mapState();
    const dataSource$: TRowsDataSource<T> = this.dataSource$();

    return dataSource$(payload).pipe(
      tap((result: IPageable<T>) => this.setRows(result)),
      finalize(() => this.setLoading(false)),
      catchError(() =>
        throwError$(new Error(this.translate('errors.unknownError')))
      )
    );
  }

  /**
   *
   *
   * @param {IDgFormValue} $event
   * @return {Subscription}
   * @memberof BaseListComponent
   */
  public onSearch($event: IDgFormValue): Subscription {
    if (Util.toJson(this.metadata.search) !== Util.toJson($event)) {
      this.metadata.page = 1;
      this.metadata.search = $event;
    }

    return this.reload();
  }

  /**
   *
   *
   * @param {number} index
   * @param {T} row
   * @returns {number}
   * @memberof BaseListComponent
   */
  public trackById(index: number, row: T): number {
    return _.get(row, 'id') as number;
  }

  /**
   *
   *
   * @param {number} page
   * @memberof BaseListComponent
   */
  public onChangePage(page: number): void {
    this.metadata.page = page;
  }

  /**
   *
   *
   * @param {T} row
   * @returns {Subscription}
   * @memberof BaseListComponent
   */
  public updateRow(row: T): Subscription {
    return this._subscription.add(
      this.navigate$([`/${this.pageName}/update`, row.id]).subscribe()
    );
  }

  /**
   *
   *
   * @param {T} row
   * @returns {Subscription}
   * @memberof BaseListComponent
   */
  public viewDetail(row: T): Subscription {
    return this._subscription.add(
      this.navigate$([`/${this.pageName}/detail`, row.id]).subscribe()
    );
  }

  /**
   *
   *
   * @memberof BaseListComponent
   */
  public createNew(): Subscription {
    return this._subscription.add(
      this.navigate$([`/${this.pageName}/create`]).subscribe()
    );
  }

  /**
   *
   *
   * @param {T} row
   * @returns {Subscription}
   * @memberof BaseListComponent
   */
  public deleteRow(row: T): Subscription {
    return this._subscription.add(
      this.navigate$([`/${this.pageName}/delete`, row.id]).subscribe()
    );
  }

  /**
   *
   *
   * @param {(string|'exclamation-circle')} [shape='trash']
   * @return {ITooltipIconOptions}
   * @memberof BaseListComponent
   */
  public getIconOptions(
    shape: string | 'exclamation-circle' = 'trash'
  ): ITooltipIconOptions {
    return {
      clazz: 'action-icon',
      size: 'md',
      icon: {
        shape,
        size: 16,
      },
      position: 'top-left',
    };
  }

  /**
   *
   * @returns {T[]}
   * @memberof BaseListComponent
   */
  public exportAsCsv(): T[] {
    const filename: string = `download-${this.pageName}`;
    const data: T[] = _.cloneDeep(this.rows);
    return this._csvSvc.generate<T>(data, filename);
  }

  /**
   *
   *
   * @returns {string}
   * @memberof BaseListComponent
   */
  public get dataGridStyle(): string {
    return 'datagrid-compact';
  }

  /**
   *
   *
   * @param {T} row
   * @param {TModalState} [modalState='status']
   * @memberof BaseListComponent
   */
  public openModal(row: T, modalState: TModalState = 'status'): void {
    this.modalState = modalState;
    this.selected = row;
    this.$modal.open();
  }

  /**
   *
   *
   * @memberof BaseListComponent
   */
  public closeModal(): void {
    this.modalState = null;
    this.selected = null;
    this.$modal.close();
    this.reload();
  }

  /**
   *
   *
   * @param {string} [type='header']
   * @param {string} [action='index']
   * @param {*} [params={}]
   * @return {string}
   * @memberof BaseListComponent
   */
  public getPageText(
    type: string = 'header',
    action: string = 'index',
    params: any = {}
  ): string {
    return super.getPageText(type, action, params);
  }

  /**
   *
   *
   * @param {T} row
   * @param {keyof T} associate
   * @return {Subscription}
   * @memberof BaseListComponent
   */
  public navigateToCascadingDetail(row: T, associate: keyof T): Subscription {
    const id: number = _.get(row, `${String(associate)}.id`) || 0;
    const commands: any[] = [`/${String(associate)}/detail/${id}`];
    const navigationExtras: NavigationExtras = {
      queryParams: {
        backUrl: `/${this.pageName}`,
      },
      queryParamsHandling: 'merge',
    };

    return this._subscription.add(
      this.navigate$(commands, navigationExtras).pipe(take(1)).subscribe()
    );
  }
}
