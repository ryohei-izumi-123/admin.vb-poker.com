import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, filter, tap, distinctUntilChanged } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { TranslateService } from '@ngx-translate/core';
import { IEntity, ITreeRouteDataRows } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';
import { BaseFormComponent } from '@core/class/base-form.component';

/**
 *
 *
 * @export
 * @class BaseTreeComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-base-tree',
  template: '',
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class BaseTreeComponent<
    T extends IEntity,
    P extends BaseRestService<T>
  >
  extends BaseFormComponent
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @protected
   * @type {T[]}
   * @memberof BaseTreeComponent
   */
  protected _nodes: T[] = [];

  /**
   *
   *
   * @type {T[]}
   * @memberof BaseTreeComponent
   */
  public get nodes(): T[] {
    return this._nodes;
  }

  /**
   *
   *
   * @memberof BaseTreeComponent
   */
  @Input()
  public set nodes(nodes: T[]) {
    this._nodes = nodes;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of BaseTreeComponent.
   * @param {TranslateService} _translateSvc
   * @param {BaseRestService<T>} _restSvc
   * @param {Router} _router
   * @param {ActivatedRoute} _route
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseTreeComponent
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
   * @memberof BaseTreeComponent
   */
  public ngOnInit() {
    this.initForm();
    this._subscription.add(this.fromRouteData$().subscribe());
  }

  /**
   *
   *
   * @memberof BaseTreeComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   *
   * @returns {Observable<T>}
   * @memberof BaseTreeComponent
   */
  protected fromRouteData$(): Observable<T[]> {
    return this._route.data.pipe(
      map((data: ITreeRouteDataRows<T>) => _.get(data, 'nodes')),
      filter((nodes: T[]) => !!!_.isEmpty(nodes)),
      tap((nodes: T[]) => (this.nodes = nodes)),
      distinctUntilChanged()
    );
  }

  /**
   *
   *
   * @memberof BaseTreeComponent
   */
  public abstract initForm(): void;

  /**
   *
   *
   * @returns {Subscription}
   * @memberof BaseTreeComponent
   */
  public abstract onSubmit(): Subscription;
}
