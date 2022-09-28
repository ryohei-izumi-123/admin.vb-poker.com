import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ApiService } from '@shared/services/api.service';
import { IOption } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';
import { distinctUntilChanged } from 'rxjs/operators';

/**
 *
 *
 * @export
 * @class OptionService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class OptionService
  extends BaseRestService<IOption>
  implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof OptionService
   */
  public endpoint: string = 'options';
  /**
   *
   *
   * @protected
   * @type {BehaviorSubject<IOption>}
   * @memberof OptionService
   */
  protected _optionSubject: BehaviorSubject<IOption> = new BehaviorSubject<IOption>(
    null
  );

  /**
   *
   *
   * @type {Observable<IOption>}
   * @memberof OptionService
   */
  public option$: Observable<IOption> = this._optionSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {IOption}
   * @memberof OptionService
   */
  public get option(): IOption {
    return this._optionSubject.getValue();
  }

  /**
   *
   *
   * @param {ICustomer[]} option
   * @returns {void}
   * @memberof OptionService
   */
  public set option(option: IOption) {
    this._optionSubject.next(option);
  }

  /**
   *Creates an instance of OptionService.
   * @param {ApiService} _apiSvc
   * @memberof OptionService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }

  /**
   *
   *
   * @memberof OptionService
   */
  public ngOnDestroy() {
    this._optionSubject.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @return {Observable<IOption>}
   * @memberof OptionService
   */
  public getOption$(): Observable<IOption> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}`;
    return this._apiSvc.get<IOption>(url).pipe(
      tap((option: IOption) => (this.option = option)),
      take(1)
    );
  }
}
