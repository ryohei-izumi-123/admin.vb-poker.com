import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  forwardRef,
  NgZone,
  AfterViewInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as uuid from 'uuid';
import {
  JSONEditorMode,
  JSONEditorOptions,
  default as JSONEditor,
} from 'jsoneditor';
import { _, Util } from '@core/class/util';
import { AppValidator } from '@core/class/app-validator';
import { BaseComponent } from '@core/class/base.component';
import { ILanguageSchemaValidateResult } from '@shared/interfaces';
import { LanguageService, LocaleService } from '@shared/services';

/**
 *
 *
 * @export
 * @class JsonEditorComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-json-editor',
  templateUrl: './json-editor.component.html',
  styleUrls: ['./json-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JsonEditorComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useValue: Validators.required,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useValue: AppValidator.isJson,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => JsonEditorComponent),
      multi: true,
    },
  ],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonEditorComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor, Validator {
  /**
   *
   *
   * @memberof JsonEditorComponent
   */
  public id = `json-editor-${uuid.v4()}`;

  /**
   *
   *
   * @private
   * @memberof JsonEditorComponent
   */
  private onTouched: (arg?: any) => any = (arg?: any) => {};

  /**
   *
   *
   * @private
   * @memberof JsonEditorComponent
   */
  private onChange: (arg?: any) => any = (arg?: any) => {};

  /**
   *
   *
   * @private
   * @memberof JsonEditorComponent
   */
  private onValidatorChange: (arg?: any) => any = (arg?: any) => {};

  /**
   *
   *
   * @private
   * @type {JSONEditor}
   * @memberof JsonEditorComponent
   */
  private _editor: JSONEditor;

  /**
   *
   *
   * @type {JSONEditor}
   * @memberof JsonEditorComponent
   */
  public get editor(): JSONEditor {
    return this._editor;
  }

  /**
   *
   *
   * @memberof JsonEditorComponent
   */
  public set editor(editor: JSONEditor) {
    this._editor = editor;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {boolean}
   * @memberof JsonEditorComponent
   */
  private _disabled: boolean = false;

  /**
   *
   *
   * @type {boolean}
   * @memberof JsonEditorComponent
   */
  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   *
   *
   * @memberof JsonEditorComponent
   */
  public set disabled(disabled: boolean) {
    this._disabled = disabled;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @type {ElementRef}
   * @memberof JsonEditorComponent
   */
  @ViewChild('$container', { static: true })
  public $container: ElementRef;

  /**
   *
   *
   * @private
   * @type {JSONEditorOptions}
   * @memberof JsonEditorComponent
   */
  private _options: JSONEditorOptions = {
    enableSort: false,
    enableTransform: false,
    escapeUnicode: false,
    sortObjectKeys: true,
    history: false,
    search: false,
    mode: 'tree',
    indentation: 4,
    mainMenuBar: true,
    navigationBar: true,
    statusBar: false,
  };

  /**
   *
   *
   * @type {JSONEditorOptions}
   * @memberof JsonEditorComponent
   */
  public get options(): JSONEditorOptions {
    return this._options;
  }

  /**
   *
   *
   * @memberof JsonEditorComponent
   */
  @Input()
  public set options(options: JSONEditorOptions) {
    this._options = options;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @private
   * @type {object}
   * @memberof JsonEditorComponent
   */
  private _data: object = {};

  /**
   *
   *
   * @readonly
   * @type {object}
   * @memberof JsonEditorComponent
   */
  public get data(): object {
    return this._data;
  }

  /**
   *
   *
   * @memberof JsonEditorComponent
   */
  @Input()
  public set data(data: object) {
    this._data = data;
    this.set(data);
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @type {EventEmitter<any>}
   * @memberof JsonEditorComponent
   */
  @Output()
  // tslint:disable-next-line: no-output-native
  public onChange$: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Creates an editor of JsonEditorComponent.
   * @param {LanguageService} _languageSvc
   * @param {NgZone} _ngZone
   * @param {TranslateService} _translateSvc
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof JsonEditorComponent
   */
  public constructor(
    @SkipSelf() @Optional() private _localeSvc: LocaleService,
    @SkipSelf() @Optional() private _languageSvc: LanguageService,
    private _ngZone: NgZone,
    protected _translateSvc: TranslateService,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(_translateSvc, _router, _changeDetectorRef);
  }

  /**
   *
   *
   * @memberof JsonEditorComponent
   */
  public ngOnDestroy() {
    this.destroy();
    this.onChange$.complete();
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @memberof JsonEditorComponent
   */
  public ngAfterViewInit(): void {
    _.set(this.options, 'language', this._localeSvc.locale);
    if (_.isObjectLike(this.options)) {
      _.set(this.options, 'onChange', this._valueChanged.bind(this));
    }

    this.editor = new JSONEditor(
      this.$container.nativeElement,
      this.options,
      this.data
    );
  }

  /**
   *
   * @description onChange event on JsonEditor inside(outside of angular app)
   * @private
   * @memberof JsonEditorComponent
   */
  private _valueChanged(): void {
    const json: object = this.get();
    this.onChange(json);
    this.onChange$.emit(json);
  }

  /**
   *
   *
   * @param {*} value
   * @memberof JsonEditorComponent
   */
  public writeValue(value: any): void {
    this.data = value;
  }

  /**
   *
   *
   * @param {AbstractControl} control
   * @return {ValidationErrors}
   * @memberof JsonEditorComponent
   */
  public validate(ctrl: AbstractControl): ValidationErrors {
    const error: ValidationErrors = { isJsonSchema: true };
    if (ctrl.disabled || ctrl.pristine || _.isEmpty(ctrl.value)) {
      return null;
    }

    const {
      isValid,
      errorsAt,
    }: ILanguageSchemaValidateResult = this._languageSvc.validateSchema(
      Util.fromJson(ctrl.value)
    );
    if (!isValid) {
      _.set(error, 'isJsonSchema.property', errorsAt);
    }

    this._changeDetectorRef.markForCheck();
    return isValid ? null : error;
  }

  /**
   *
   *
   * @param {() => any} fn
   * @memberof JsonEditorComponent
   */
  public registerOnChange(fn: () => any) {
    this.onChange = fn;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @param {() => any} fn
   * @memberof JsonEditorComponent
   */
  public registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @param {() => void} fn
   * @memberof JsonEditorComponent
   */
  public registerOnValidatorChange?(fn: () => void): void {
    this.onValidatorChange = fn;
    this._changeDetectorRef.markForCheck();
  }

  /**
   *
   *
   * @param {boolean} isDisabled
   * @memberof JsonEditorComponent
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   *
   * @description part of jsoneditor api
   * @memberof JsonEditorComponent
   */
  public collapseAll(): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() => this.editor.collapseAll());
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @memberof JsonEditorComponent
   */
  public expandAll(): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() => this.editor.expandAll());
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @memberof JsonEditorComponent
   */
  public focus(): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() => this.editor.focus());
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @return {object}
   * @memberof JsonEditorComponent
   */
  public get(): object {
    if (this.editor) {
      return this.editor.get();
    }

    return null;
  }

  /**
   *
   * @description part of jsoneditor api
   * @return {JsonEditorMode}
   * @memberof JsonEditorComponent
   */
  public get mode(): JSONEditorMode {
    if (this.editor) {
      return this.editor.getMode() as JSONEditorMode;
    }

    return null;
  }

  /**
   *
   * @description part of jsoneditor api
   * @return {string}
   * @memberof JsonEditorComponent
   */
  public get name(): string {
    if (this.editor) {
      return this.editor.getName();
    }

    return null;
  }

  /**
   *
   * @description part of jsoneditor api
   * @return {string}
   * @memberof JsonEditorComponent
   */
  public get text(): string {
    if (this.editor) {
      return this.editor.getText();
    }

    return null;
  }

  /**
   *
   * @description part of jsoneditor api
   * @param {object} json
   * @memberof JsonEditorComponent
   */
  public set(json: object): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() => this.editor.set(json));
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @param {JSONEditorMode} mode
   * @memberof JsonEditorComponent
   */
  public setMode(mode: JSONEditorMode): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() => this.editor.setMode(mode));
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @param {string} name
   * @memberof JsonEditorComponent
   */
  public setName(name: string): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() => this.editor.setName(name));
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @param {*} start
   * @param {*} end
   * @memberof JsonEditorComponent
   */
  public setSelection(start: any, end: any): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() =>
        this.editor.setSelection(start, end)
      );
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @return {*}
   * @memberof JsonEditorComponent
   */
  public getSelection(): any {
    if (this.editor) {
      return this.editor.getSelection();
    }

    return null;
  }

  /**
   *
   * @description part of jsoneditor api
   * @param {object} schema
   * @param {object} schemaRefs
   * @memberof JsonEditorComponent
   */
  public setSchema(schema: object, schemaRefs: object): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() =>
        this.editor.setSchema(schema, schemaRefs)
      );
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @param {object} json
   * @memberof JsonEditorComponent
   */
  public update(json: object): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() => this.editor.update(json));
    }
  }

  /**
   *
   * @description part of jsoneditor api
   * @memberof JsonEditorComponent
   */
  public destroy(): void {
    if (this.editor) {
      this._ngZone.runOutsideAngular(() => this.editor.destroy());
    }
  }
}
