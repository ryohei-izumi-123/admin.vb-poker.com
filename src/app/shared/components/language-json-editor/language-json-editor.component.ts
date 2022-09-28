import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  forwardRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseComponent } from '@core/class/base.component';
import { _, Util } from '@core/class/util';
import { IJsonNode } from '@shared/interfaces/json';

/**
 *
 * @deprecated 見た目はこちらのほうがCLRフレームワークに統一されていて良いのだが、パフォーマンスとJSONの操作（新規ノード追加など）の店でjsoneditorを使った実装を現状採用。
 * @export
 * @class LanguageJsonEditorComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-language-json-editor',
  templateUrl: './language-json-editor.component.html',
  styleUrls: ['./language-json-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LanguageJsonEditorComponent),
      multi: true,
    },
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageJsonEditorComponent
  extends BaseComponent
  implements OnInit, OnDestroy, OnChanges, ControlValueAccessor {
  /**
   *
   *
   * @private
   * @memberof LanguageJsonEditorComponent
   */
  private onTouched: (arg?: any) => any = () => {};

  /**
   *
   *
   * @private
   * @memberof LanguageJsonEditorComponent
   */
  private onChange: (arg?: any) => any = ($event: any) => {};

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof LanguageJsonEditorComponent
   */
  private _disabled: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof LanguageJsonEditorComponent
   */
  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   *
   *
   * @memberof LanguageJsonEditorComponent
   */
  @Input()
  public set disabled(disabled: boolean) {
    this._disabled = disabled;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @protected
   * @type {IJsonNode[]}
   * @memberof LanguageJsonEditorComponent
   */
  protected _nodes: IJsonNode[] = [];

  /**
   *
   *
   * @type {IJsonNode[]}
   * @memberof LanguageJsonEditorComponent
   */
  public get nodes(): IJsonNode[] {
    return this._nodes;
  }

  /**
   *
   *
   * @memberof LanguageJsonEditorComponent
   */
  public set nodes(nodes: IJsonNode[]) {
    this._nodes = nodes;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {string}
   * @memberof LanguageJsonEditorComponent
   */
  private _json: string = null;

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof LanguageJsonEditorComponent
   */
  public get json(): string {
    return this._json;
  }

  /**
   *
   *
   * @readonly
   * @type {string}
   * @memberof LanguageJsonEditorComponent
   */
  public set json(json: string) {
    if (_.isObjectLike(json)) {
      json = Util.toJson(json);
    }

    this._json = json;
    this.onChange(json);
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Creates an instance of LanguageJsonEditorComponent.
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof LanguageJsonEditorComponent
   */
  public constructor(
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @param {SimpleChanges} changes
   * @memberof LanguageJsonEditorComponent
   */
  public ngOnChanges(changes: SimpleChanges) {}

  /**
   *
   * @description `ControlValueAccessor` interfaceの一部。外部から値をセットされる時に呼ばれる処理。
   * @param {*} value
   * @memberof LanguageJsonEditorComponent
   */
  public writeValue(value: any): void {
    this.json = value;
    if (_.isString(value)) {
      value = Util.fromJson(value);
    }

    this.nodes = this.forgeNodes(value);
  }

  /**
   *
   * @description `ControlValueAccessor` interfaceの一部。
   * @param {() => any} fn
   * @memberof LanguageJsonEditorComponent
   */
  public registerOnChange(fn: () => any) {
    this.onChange = fn;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   * @description `ControlValueAccessor` interfaceの一部。
   * @param {() => any} fn
   * @memberof LanguageJsonEditorComponent
   */
  public registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   * @description `ControlValueAccessor` interfaceの一部。
   * @param {boolean} disabled
   * @memberof LanguageJsonEditorComponent
   */
  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  /**
   *
   * @description JSONから`clr-tree`用にデータ成形する処理。
   * @param {object} data
   * @param {string} [parent=undefined]
   * @return {IJsonNode[]}
   * @memberof LanguageJsonEditorComponent
   */
  public forgeNodes(data: object, parent: string = undefined): IJsonNode[] {
    if (_.isEmpty(data)) {
      return [];
    }

    return _.keys(data)
      .map((key: string) => {
        const value: any = _.get(data, key);
        const path: string = parent ? `${parent}.${key}` : key;
        const node: IJsonNode = {
          key,
          value,
          path,
          parent,
        };

        if (_.isObjectLike(value)) {
          _.set(node, 'nodes', this.forgeNodes(value, path));
        }

        return _.pickBy(node, (v: any) => !_.isUndefined(v)) as IJsonNode;
      })
      .sort(this._sort.bind(this));
  }

  /**
   *
   * @description input の`onChange`イベント。指定されたオブジェクトパスの部分のJSONを書き換える。
   * @param {IJsonNode} node
   * @return {void}
   * @memberof LanguageJsonEditorComponent
   */
  public onValueChange($event: InputEvent, node: IJsonNode): void {
    const $input: HTMLInputElement = $event.target as HTMLInputElement;
    const path: string = _.get(node, 'path');
    let value: string = _.get($input, 'value');
    if (_.isNull(value) || _.isUndefined(value)) {
      value = '';
    }

    this.json = _.set(Util.fromJson(this.json), path, `${value}`);
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   * @description get node key name as upper case
   * @private
   * @param {IJsonNode} node
   * @return {string}
   * @memberof LanguageJsonEditorComponent
   */
  private _toUpper(node: IJsonNode): string {
    return _.toUpper(_.get(node, 'key'));
  }

  /**
   *
   * @description implements for `clr-tree-node`
   * @param {IJsonNode} node
   * @memberof LanguageJsonEditorComponent
   */
  public hasChildren = (node: IJsonNode) => _.has(node, 'nodes');

  /**
   *
   * @description implements for `clr-tree-node`
   * @param {IJsonNode} node
   * @memberof LanguageJsonEditorComponent
   */
  public getChildren = (node: IJsonNode) => _.get(node, 'nodes');

  /**
   *
   * @description sort array by object comparing
   * @private
   * @param {IJsonNode} a
   * @param {IJsonNode} b
   * @return {number}
   * @memberof LanguageJsonEditorComponent
   */
  private _sort(a: IJsonNode, b: IJsonNode): number {
    const _a: string = this._toUpper(a);
    const _b: string = this._toUpper(b);
    if (_a < _b) {
      return -1;
    }

    if (_a > _b) {
      return 1;
    }

    return 0;
  }
}
