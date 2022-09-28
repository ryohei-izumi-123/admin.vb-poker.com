import {
  Directive,
  OnInit,
  OnDestroy,
  OnChanges,
  ChangeDetectorRef,
  Input,
  TemplateRef,
  ViewContainerRef,
  SimpleChanges,
} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, skipWhile } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { BaseDirective } from '@core/class/base.directive';

/**
 *
 *
 * @export
 * @class BaseIfDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[ngBaseIf], [ngBaseIfElse]',
})
export abstract class BaseIfDirective
  extends BaseDirective
  implements OnInit, OnDestroy, OnChanges {
  /**
   *
   *
   * @protected
   * @type {BehaviorSubject<boolean>}
   * @memberof BaseIfDirective
   */
  protected _conditionSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof BaseIfDirective
   */
  public condition$: Observable<boolean> = this._conditionSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  /**
   *
   *
   * @returns {boolean}
   * @memberof BaseIfDirective
   */
  public get condition(): boolean {
    return this._conditionSubject.getValue();
  }

  /**
   *
   *
   * @param {boolean} condition
   * @returns {void}
   * @memberof BaseIfDirective
   */
  public set condition(condition: boolean) {
    this._conditionSubject.next(condition);
  }

  /**
   *
   *
   * @protected
   * @type {TemplateRef<any>}
   * @memberof BaseIfDirective
   */
  protected _elseTemplateRef: TemplateRef<any>;

  /**
   *
   *
   * @memberof BaseIfDirective
   */
  public get elseTemplateRef(): TemplateRef<any> {
    return this._elseTemplateRef;
  }

  /**
   *
   *
   * @memberof BaseIfDirective
   */
  public set elseTemplateRef(elseTemplateRef: TemplateRef<any>) {
    const isValidTemplate = elseTemplateRef instanceof TemplateRef;
    if (isValidTemplate) {
      this._elseTemplateRef = elseTemplateRef;
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   *
   *
   * @protected
   * @type {any}
   * @memberof BaseIfDirective
   */
  protected _context: any = {};

  /**
   *
   *
   * @memberof BaseIfDirective
   */
  public get context(): any {
    return this._context;
  }

  /**
   *
   *
   * @memberof BaseIfDirective
   */
  public set context(context: any) {
    this._context = context;
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of BaseIfDirective.
   * @param {TemplateRef<any>} _templateRef
   * @param {ViewContainerRef} _viewContainerRef
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof BaseIfDirective
   */
  public constructor(
    protected _templateRef: TemplateRef<any>,
    protected _viewContainerRef: ViewContainerRef,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_changeDetectorRef);
  }

  /**
   *
   *
   * @memberof BaseIfDirective
   */
  public ngOnInit() {
    this._subscription.add(
      this.condition$
        .pipe(skipWhile((condition: boolean) => _.isNull(condition)))
        .subscribe(() => this._updateViewContainerRef())
    );
  }

  /**
   *
   *
   * @memberof BaseIfDirective
   */
  public ngOnDestroy() {
    this._viewContainerRef.detach();
    this._conditionSubject.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof BaseIfDirective
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   * @description `*ngBaseIf="true; else $template"`のようなElse構文に対応する場合。
   * @memberof BaseIfDirective
   */
  @Input()
  public set ngBaseIfElse(elseTemplateRef: TemplateRef<any>) {
    this.elseTemplateRef = elseTemplateRef;
  }

  /**
   *
   * @description selectorと同じ名前の`Input`デコレータ付きsetterは `*ngBaseIf="true"`のような条件式注入が可能になる。
   * @memberof BaseIfDirective
   */
  @Input()
  public set ngBaseIf(param: boolean) {}

  /**
   *
   *
   * @protected
   * @memberof BaseIfDirective
   */
  protected _updateViewContainerRef(): void {
    this._viewContainerRef.clear();
    if (this.condition) {
      this._viewContainerRef.createEmbeddedView(
        this._templateRef,
        this.context
      );
    } else {
      if (this.elseTemplateRef) {
        this._viewContainerRef.createEmbeddedView(
          this.elseTemplateRef,
          this.context
        );
      }
    }

    this._changeDetectorRef.markForCheck();
  }
}
