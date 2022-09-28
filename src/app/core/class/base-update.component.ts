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
import {
  AbstractControl,
  FormGroup,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import {
  Observable,
  NEVER as NEVER$,
  throwError as throwError$,
  Subscription,
  of as of$,
} from 'rxjs';
import {
  map,
  filter,
  tap,
  catchError,
  finalize,
  take,
  distinctUntilChanged,
} from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { IEntity, IDgRouteDataRow, IValidateUnique } from '@shared/interfaces';
import { TRowDataSource, TStatus } from '@shared/types';
import { ToasterService } from '@shared/services/toaster.service';
import { ValidateService } from '@shared/services/validate.service';
import { BaseRestService } from '@core/class/base-rest.service';
import { BaseFormComponent } from '@core/class/base-form.component';

/**
 *
 *
 * @export
 * @class BaseUpdateComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-update',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseUpdateComponent<
    T extends IEntity,
    P extends BaseRestService<T>
  >
  extends BaseFormComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  /**
   *
   *
   * @type {TStatus[]}
   * @memberof BaseUpdateComponent
   */
  public statuses: TStatus[] = ['active', 'pending', 'inactive'];

  /**
   *
   *
   * @protected
   * @abstract
   * @type {string}
   * @memberof BaseUpdateComponent
   */
  protected abstract _modelName: string;

  /**
   *
   *
   * @protected
   * @type {T}
   * @memberof BaseUpdateComponent
   */
  protected _row: T = null;

  /**
   *
   *
   * @type {T}
   * @memberof BaseUpdateComponent
   */
  public get row(): T {
    return this._row;
  }

  /**
   *
   *
   * @memberof BaseUpdateComponent
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
   * @memberof BaseUpdateComponent
   */
  protected dataSource$(): TRowDataSource<Partial<T>> {
    return this._restSvc.getOne$.bind(this._restSvc);
  }

  /**
   * Creates an instance of BaseUpdateComponent.
   * @param {ValidateService} _validateSvc
   * @param {TranslateService} _translateSvc
   * @param {BaseRestService<T>} _restSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseUpdateComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _validateSvc: ValidateService,
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
   * @memberof BaseUpdateComponent
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
   * @memberof BaseUpdateComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof BaseUpdateComponent
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
   * @memberof BaseUpdateComponent
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
   * @memberof BaseUpdateComponent
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
   * @protected
   * @param {SimpleChanges} changes
   * @returns {Observable<T>}
   * @memberof BaseUpdateComponent
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
   * @memberof BaseUpdateComponent
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
   * @memberof BaseUpdateComponent
   */
  public get hasRouteParamsId(): boolean {
    return _.isNumber(this.routeParamsId);
  }

  /**
   *
   *
   * @protected
   * @memberof BaseUpdateComponent
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
   * @memberof BaseUpdateComponent
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
   * @readonly
   * @protected
   * @type {T}
   * @memberof BaseUpdateComponent
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
   * @memberof BaseUpdateComponent
   */
  protected update$(): Observable<T> {
    const payload: T = this.formatFormValue;
    if (this.hasRouteParamsId) {
      _.set(payload, 'id', this.row.id);
      return this._restSvc.update$(payload).pipe(take(1));
    }

    return this._restSvc.create$(payload).pipe(take(1));
  }

  /**
   *
   *
   * @protected
   * @memberof BaseUpdateComponent
   */
  protected abstract setAsyncValidators(): void;

  /**
   *
   *
   * @protected
   * @deprecated
   * @return {Subscription}
   * @memberof BaseUpdateComponent
   */
  protected _retrySubmit(): Subscription {
    return this._subscription.add(
      this.form.statusChanges
        .pipe(
          distinctUntilChanged(),
          filter((status: string) => status === 'VALID'),
          take(1)
        )
        .subscribe(() => this.onSubmit())
    );
  }

  /**
   *
   *
   * @returns {Subscription}
   * @memberof BaseUpdateComponent
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
      this.update$()
        .pipe(
          finalize(() => (this.isBusy = false)),
          catchError((error: Error) => {
            this.error = new Error(this.translate('errors.updateFailed'));

            return NEVER$;
          }),
          take(1)
        )
        .subscribe((response: T) => {
          this.reset();
          this._toasterSvc.show({
            type: 'success',
            message: this.translate('errors.updateSuccess'),
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
   * @param {string} field
   * @returns {AsyncValidatorFn}
   * @memberof BaseUpdateComponent
   */
  public validateIsUnique$ = (field: string): AsyncValidatorFn => {
    return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
      const value: string = ctrl.value;
      const payload: IValidateUnique = {
        id: this.routeParamsId,
        model: this._modelName,
        field,
        value,
      };

      if (ctrl.disabled || ctrl.pristine || _.isEmpty(ctrl.value)) {
        return of$(null);
      }

      return this._validateSvc.isUnique$(payload).pipe(
        finalize(() => this._changeDetectorRef.markForCheck()),
        take(1)
      );
    };
  };

  /**
   *
   *
   * @param {string} [type='header']
   * @param {string} [action=undefined]
   * @param {*} [params=this.row]
   * @return {string}
   * @memberof BaseUpdateComponent
   */
  public getPageText(
    type: string = 'header',
    action: string = undefined,
    params: any = this.row
  ): string {
    if (_.isUndefined(action)) {
      action = this.hasRouteParamsId ? 'update' : 'create';
    }

    return super.getPageText(type, action, params);
  }
}
