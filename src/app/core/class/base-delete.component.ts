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
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup } from '@angular/forms';
import {
  Observable,
  Subscription,
  NEVER as NEVER$,
  throwError as throwError$,
} from 'rxjs';
import {
  map,
  filter,
  tap,
  catchError,
  take,
  finalize,
  distinctUntilChanged,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { IEntity, IDgRouteDataRow } from '@shared/interfaces';
import { TRowDataSource } from '@shared/types';
import { ToasterService } from '@shared/services';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { BaseRestService } from '@core/class/base-rest.service';
import { BaseFormComponent } from '@core/class/base-form.component';

/**
 *
 *
 * @export
 * @class BaseDeleteComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-status',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseDeleteComponent<
    T extends IEntity,
    P extends BaseRestService<T>
  >
  extends BaseFormComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @type {ModalComponent}
   * @memberof BaseDeleteComponent
   */
  @ViewChild('$modal')
  public $modal: ModalComponent;

  /**
   *
   *
   * @protected
   * @type {T}
   * @memberof BaseDeleteComponent
   */
  protected _row: T = null;

  /**
   *
   *
   * @type {T}
   * @memberof BaseDeleteComponent
   */
  public get row(): T {
    return this._row;
  }

  /**
   *
   *
   * @memberof BaseDeleteComponent
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
   * @memberof BaseDeleteComponent
   */
  protected dataSource$(): TRowDataSource<Partial<T>> {
    return this._restSvc.getOne$.bind(this._restSvc);
  }

  /**
   * Creates an instance of BaseDeleteComponent.
   * @param {TranslateService} _translateSvc
   * @param {ToasterService} _toasterSvc
   * @param {BaseRestService<T>} _restSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseDeleteComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _toasterSvc: ToasterService,
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
   * @memberof BaseDeleteComponent
   */
  public ngOnInit() {
    this.initForm();
    if (this.hasRouteParamsId) {
      this._subscription.add(this.fromRouteData$().subscribe());
    }
  }

  /**
   *
   *
   * @memberof BaseDeleteComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof BaseDeleteComponent
   */
  public ngOnChanges(changes: SimpleChanges) {
    this._subscription.add(this.fromInput$(changes).subscribe());
  }

  /**
   *
   *
   * @protected
   * @param {SimpleChanges} changes
   * @returns {Observable<T>}
   * @memberof BaseDeleteComponent
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
   * @protected
   * @param {T} payload
   * @returns {Observable<T>}
   * @memberof BaseDeleteComponent
   */
  protected fetchRow$(payload: T): Observable<T> {
    const dataSource$: TRowDataSource<Partial<T>> = this.dataSource$();

    return dataSource$(payload).pipe(
      filter((row: T) => !!!_.isEmpty(row)),
      tap((row: T) => (this.row = row)),
      tap(() => this.setFormValueFromRowData()),
      catchError(() =>
        throwError$(new Error(this.translate('errors.unknownError')))
      )
    );
  }

  /**
   *
   *
   * @returns {Observable<T>}
   * @memberof BaseDeleteComponent
   */
  protected fromRouteData$(): Observable<T> {
    return this._route.data.pipe(
      map((data: IDgRouteDataRow<T>) => _.get(data, 'row')),
      filter((row: T) => !!!_.isEmpty(row)),
      tap((row: T) => (this.row = row)),
      tap(() => this.setFormValueFromRowData()),
      distinctUntilChanged()
    );
  }

  /**
   *
   *
   * @readonly
   * @type {number}
   * @memberof BaseDeleteComponent
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
   * @memberof BaseDeleteComponent
   */
  public get hasRouteParamsId(): boolean {
    return _.isNumber(this.routeParamsId);
  }

  /**
   *
   *
   * @protected
   * @memberof BaseDeleteComponent
   */
  protected setFormValueFromRowData(): void {
    if (!_.isEmpty(this.row)) {
      this.pluckRowDataToFormControl();
    }
  }

  /**
   *
   *
   * @protected
   * @param {FormGroup} [form=this.form]
   * @param {string} [parent=undefined]
   * @param {(keyof T)[]} [ignore=[]]
   * @memberof BaseDeleteComponent
   */
  protected pluckRowDataToFormControl(
    form: FormGroup = this.form,
    parent: string = undefined,
    ignore: (keyof T)[] = []
  ): void {
    this.getFormCtrlFields(form)
      .filter((field: keyof T) => !ignore.includes(field))
      .map((field: keyof T) => {
        const ctrl: AbstractControl = _.get(form, `controls.${String(field)}`);
        if (!!!_.isEmpty(ctrl)) {
          if (ctrl instanceof FormGroup) {
            return this.pluckRowDataToFormControl(ctrl, `${String(field)}`);
          }

          const value: string = parent
            ? _.get(this.row, `${parent}.${String(field)}`)
            : _.get(this.row, field);
          const isValid: boolean =
            !!!_.isNull(value) && !!!_.isUndefined(value);
          if (isValid) {
            ctrl.patchValue(value);
          }
        }
      });
  }

  /**
   *
   *
   * @memberof BaseDeleteComponent
   */
  public abstract initForm(): void;

  /**
   *
   *
   * @readonly
   * @protected
   * @type {T}
   * @memberof BaseDeleteComponent
   */
  protected get formatFormValue(): T {
    const payload: T = this.form.value as T;
    return payload;
  }

  /**
   *
   *
   * @protected
   * @returns {Observable<T>}
   * @memberof BaseDeleteComponent
   */
  protected delete$(): Observable<T> {
    const payload: T = this.formatFormValue;
    _.set(payload, 'id', this.row.id);

    return this._restSvc.delete$(payload).pipe(take(1));
  }

  /**
   *
   *
   * @returns {Subscription}
   * @memberof BaseDeleteComponent
   */
  public onSubmit(): Subscription {
    const isValid: boolean = this.form.valid;
    const isBusy: boolean = this.isBusy;
    if (!isValid || isBusy) {
      return this._subscription.add(NEVER$.subscribe());
    }

    this.isBusy = true;
    this.error = null;

    return this._subscription.add(
      this.delete$()
        .pipe(
          catchError((error: Error) => {
            this.error = new Error(this.translate('errors.deleteFailed'));

            return NEVER$;
          }),
          finalize(() => (this.isBusy = false)),
          take(1)
        )
        .subscribe((response: T) => {
          this.reset();
          this._toasterSvc.show({
            type: 'success',
            message: this.translate('errors.deleteSuccess'),
          });

          return this._subscription.add(
            this.navigate$([`/${this.pageName}/`])
              .pipe(take(1))
              .subscribe()
          );
        })
    );
  }

  /**
   *
   *
   * @param {string} [type='header']
   * @param {string} [action='delete']
   * @param {*} [params=this.row]
   * @return {string}
   * @memberof BaseDeleteComponent
   */
  public getPageText(
    type: string = 'header',
    action: string = 'delete',
    params: any = this.row
  ): string {
    return super.getPageText(type, action, params);
  }
}
