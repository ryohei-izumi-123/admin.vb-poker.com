import {
  Directive,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { IDraggablePosition } from '@shared/interfaces';
import { BaseDirective } from '@core/class/base.directive';

/**
 *
 *
 * @export
 * @class DraggableDirective
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Directive({
  selector: '[ngDraggable]',
})
export class DraggableDirective
  extends BaseDirective
  implements OnInit, OnDestroy {
  /**
   * something like api
   *
   * @type {EventEmitter<IDraggablePosition>}
   * @memberof DraggableDirective
   */
  @Output()
  public draggableEvent: EventEmitter<IDraggablePosition> = new EventEmitter();

  /**
   *
   *
   * @private
   * @type {HTMLElement}
   * @memberof DraggableDirective
   */
  private _$dom: HTMLElement;

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  public mouseUp: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  public mouseDown: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  public mouseMove: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   *
   *
   * @type {EventEmitter<MouseEvent>}
   * @memberof DraggableDirective
   */
  public mouseDrag$: Observable<IDraggablePosition>;

  /**
   *
   *
   * @param {MouseEvent} [$event]
   * @memberof DraggableDirective
   */
  @HostListener('document:mouseup', ['$event'])
  public onMouseup($event: MouseEvent): void {
    if (!this.checkIsClickable($event)) {
      this.mouseUp.emit($event);
    }
  }

  /**
   *
   *
   * @param {MouseEvent} [$event]
   * @returns
   * @memberof DraggableDirective
   */
  @HostListener('mousedown', ['$event'])
  public onMousedown($event: MouseEvent): void {
    if (!this.checkIsClickable($event)) {
      this.mouseDown.emit($event);
      return $event.preventDefault();
    }
  }

  /**
   *
   *
   * @param {MouseEvent} [$event]
   * @memberof DraggableDirective
   */
  @HostListener('document:mousemove', ['$event'])
  public onMousemove($event: MouseEvent): void {
    if (!this.checkIsClickable($event)) {
      this.mouseMove.emit($event);
    }
  }

  /**
   * Creates an instance of DraggableDirective.
   * @param {ElementRef} _elementRef
   * @param {TemplateRef<any>} _templateRef
   * @param {ViewContainerRef} _viewContainerRef
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof DraggableDirective
   */
  public constructor(
    private _elementRef: ElementRef,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_changeDetectorRef);
  }

  /**
   *
   *
   * @private
   * @param {(UIEvent | MouseEvent)} $event
   * @returns {boolean}
   * @memberof DraggableDirective
   */
  private checkIsClickable($event: UIEvent | MouseEvent): boolean {
    return (
      false ||
      $event.target instanceof HTMLButtonElement ||
      $event.target instanceof HTMLFormElement ||
      $event.target instanceof HTMLAnchorElement ||
      $event.target instanceof HTMLInputElement ||
      $event.target instanceof HTMLTextAreaElement ||
      $event.target instanceof HTMLSelectElement ||
      $event.target instanceof HTMLLinkElement ||
      $event.target instanceof HTMLFormControlsCollection
    );
  }

  /**
   *
   *
   * @memberof DraggableDirective
   */
  public ngOnInit() {
    this._$dom = this._elementRef.nativeElement;
    const mapOperator = ($event: MouseEvent) => {
      const top: number =
        $event.clientY - this._$dom.getBoundingClientRect().top;
      const left: number =
        $event.clientX - this._$dom.getBoundingClientRect().left;

      return {
        top,
        left,
      } as IDraggablePosition;
    };

    const mergeMapOperator = (offset: IDraggablePosition) => {
      return this.mouseMove.pipe(
        map(($event: MouseEvent) => {
          const top: number = $event.clientY - offset.top;
          const left: number = $event.clientX - offset.left;

          return {
            top,
            left,
          } as IDraggablePosition;
        })
      );
    };

    this.mouseDrag$ = this.mouseDown.pipe(
      map(($event: MouseEvent) => mapOperator($event)),
      mergeMap((offset: IDraggablePosition) =>
        mergeMapOperator(offset).pipe(takeUntil(this.mouseUp))
      )
    );

    this._subscription.add(
      this.mouseDrag$.subscribe((position: IDraggablePosition) =>
        this.draggableEvent.emit(position)
      )
    );
  }

  /**
   *
   *
   * @memberof DraggableDirective
   */
  public ngOnDestroy() {
    this.mouseDown.complete();
    this.mouseMove.complete();
    this.mouseUp.complete();
    this.draggableEvent.complete();
    this.mouseDrag$.subscribe({ complete: null });
    super.ngOnDestroy();
  }
}
