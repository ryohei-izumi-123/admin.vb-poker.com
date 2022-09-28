import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Validators,
  FormControl,
  FormGroup,
  AbstractControl,
} from '@angular/forms';
import { Subject, Subscription, timer as timer$ } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { _ } from '@core/class/util';
import { CKEditor5, CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import {
  ChangeEvent,
  BlurEvent,
} from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from '@fizz.js/ckeditor5';
import { TranslateService } from '@ngx-translate/core';
import { IWebpage, IFile } from '@shared/interfaces';
import {
  ImgService,
  FileService,
  LocaleService,
  WebpageService,
  ValidateService,
  ToasterService,
} from '@shared/services';
import { TPageType, TIso6391 } from '@shared/types';
import { BaseUpdateComponent } from '@core/class/base-update.component';

/**
 *
 *
 * @type TUploaderRequest
 */
type TUploaderRequest = (file: File) => Promise<IFile>;

/**
 *
 *
 * @type TUploaderAbort
 */
type TUploaderAbort = () => any;

/**
 *
 *
 * @interface IUploaderAdapter
 */
interface IUploaderAdapter {
  abort(): void;
  upload(): Promise<IUploaderFileResponse>;
}

/**
 *
 *
 * @interface IUploaderFileLoader
 */
interface IUploaderFileLoader {
  file: Promise<File>;
  uploadTotal: number;
  uploaded: boolean;
}
/**
 *
 *
 * @interface IUploaderFileErrorResponse
 */
interface IUploaderFileErrorResponse {
  error: IUploaderFileErrorResponseMessage;
}

/**
 *
 *
 * @interface IUploaderFileErrorResponseMessage
 */
interface IUploaderFileErrorResponseMessage {
  message: string;
}

/**
 *
 *
 * @interface IUploaderFileResponse
 */
interface IUploaderFileResponse {
  urls?: IUploaderFileResponseUrls;
  url?: string;
}

/**
 *
 *
 * @interface IUploaderFileResponse
 */
interface IUploaderFileResponseUrls {
  default: string;
}

/**
 *
 *
 * @class UploaderAdapter
 * @implements {IUploaderAdapter}
 */
class UploaderAdapter implements IUploaderAdapter {
  /**
   *
   *
   * @private
   * @type {IUploaderFileLoader}
   * @memberof UploaderAdapter
   */
  private _loader: IUploaderFileLoader;

  /**
   *
   *
   * @private
   * @type {TUploaderRequest}
   * @memberof UploaderAdapter
   */
  private _request: TUploaderRequest;

  /**
   *
   *
   * @private
   * @type {TUploaderAbort}
   * @memberof UploaderAdapter
   */
  private _abort: TUploaderAbort;

  /**
   * Creates an instance of UploaderAdapter.
   * @param {IUploaderFileLoader} loader
   * @param {TUploaderRequest} request
   * @param {TUploaderAbort} abort
   * @memberof UploaderAdapter
   */
  public constructor(
    loader: IUploaderFileLoader,
    request: TUploaderRequest,
    abort: TUploaderAbort
  ) {
    this._loader = loader;
    this._request = request;
    this._abort = abort;
  }

  /**
   *
   * @see `_loader.file` は`FilePromiseWrapper` という`PromiseLike`な型で`async/await`を使うと挙動がおかしくなるので注意。
   * @return {Promise<IUploaderFileResponse>}
   * @memberof UploaderAdapter
   */
  public upload(): Promise<IUploaderFileResponse> {
    return new Promise((resolve, reject) => {
      this._loader.file
        .then((file: File) =>
          this._request(file)
            .then((res: IFile) => {
              const urls: IUploaderFileResponseUrls = {
                default: res.url,
              };
              this._loader.uploadTotal = res.size;
              this._loader.uploaded = true;

              return resolve({ urls });
            })
            .catch((e) => reject(this._formatError(e)))
        )
        .catch((e) => reject(this._formatError(e)));
    });
  }

  /**
   *
   *
   * @private
   * @param {Error} error
   * @return {IUploaderFileErrorResponse}
   * @memberof UploaderAdapter
   */
  private _formatError(error: Error): IUploaderFileErrorResponse {
    return { error: { message: error.message } };
  }

  /**
   *
   *
   * @memberof UploaderAdapter
   */
  public abort(): void {
    this._abort();
  }
}

/**
 *
 *
 * @export
 * @class WebpageUpdateComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-webpage-update',
  templateUrl: './webpage-update.component.html',
  styleUrls: ['./webpage-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebpageUpdateComponent
  extends BaseUpdateComponent<IWebpage, WebpageService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @type {CKEditor5.Config}
   * @memberof WebpageUpdateComponent
   */
  public config: CKEditor5.Config = {
    fontFamily: {
      options: ['default', 'Roboto, sans-serif'],
    },
    fontSize: {
      options: [9, 10, 11, 12, 13, 14, 15],
    },
    language: this._localeSvc.locale,
  };

  /**
   *
   *
   * @readonly
   * @memberof WebpageUpdateComponent
   */
  public get uploadAdapterPlugin() {
    return (editor: CKEditor5.Editor) => {
      editor.plugins.get('FileRepository').createUploadAdapter = (
        loader: IUploaderFileLoader
      ) => {
        const abort$: Subject<void> = new Subject<void>();
        const request$: (file: File) => Promise<IFile> = (file: File) =>
          this._fileSvc
            .upload$(file)
            .pipe(takeUntil(abort$), take(1))
            .toPromise();

        return new UploaderAdapter(loader, request$, () => abort$.next());
      };
    };
  }

  /**
   *
   *
   * @type {CKEditor5.Editor}
   * @memberof WebpageUpdateComponent
   */
  public editor: CKEditor5.Editor = ClassicEditor;

  /**
   *
   *
   * @type {CKEditorComponent}
   * @memberof WebpageUpdateComponent
   */
  @ViewChild('$editor')
  public $editor: CKEditorComponent;

  /**
   *
   *
   * @type {TPageType[]}
   * @memberof WebpageUpdateComponent
   */
  public pageTypes: TPageType[] = ['about', 'service', 'faq'];

  /**
   *
   *
   * @type {TIso6391[]}
   * @memberof WebpageUpdateComponent
   */
  public locales: TIso6391[] = ['en', 'ja'];

  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof WebpageUpdateComponent
   */
  protected _modelName: string = 'webpages';

  /**
   * Creates an instance of WebpageUpdateComponent.
   * @param {LocaleService} _localeSvc
   * @param {FileService} _fileSvc
   * @param {TranslateService} _translateSvc
   * @param {ValidateService} _validateSvc
   * @param {ToasterService} _toasterSvc
   * @param {ImgService} _imgSvc
   * @param {WebpageService} _webpageSvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof WebpageUpdateComponent
   */
  public constructor(
    private _localeSvc: LocaleService,
    private _fileSvc: FileService,
    protected _translateSvc: TranslateService,
    protected _validateSvc: ValidateService,
    protected _toasterSvc: ToasterService,
    protected _imgSvc: ImgService,
    protected _webpageSvc: WebpageService,
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _validateSvc,
      _toasterSvc,
      _webpageSvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof WebpageUpdateComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      pageType: new FormControl(
        null,
        Validators.compose([Validators.required])
      ),
      locale: new FormControl(null, Validators.compose([Validators.required])),
      content: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(16384),
        ])
      ),
      status: new FormControl(null, Validators.compose([Validators.required])),
    });
    this.setAsyncValidators();
  }

  /**
   *
   *
   * @protected
   * @memberof WebpageUpdateComponent
   */
  protected setAsyncValidators(): void {}

  /**
   *
   *
   * @memberof WebpageUpdateComponent
   */
  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  /**
   *
   * @deprecated
   * @description このメソッドを`ngOnDestroy`内で呼んでもエレメントが破壊された後なので必ずエラーになるので使用しないこと。
   * @private
   * @memberof WebpageUpdateComponent
   */
  private _destroy(): void {
    try {
      this.$editor.editorInstance.destroy();
    } catch (e) {}
  }

  /**
   *
   * @memberof WebpageUpdateComponent
   */
  public ngAfterViewInit() {}

  /**
   *
   * @description ソース編集モードを最後にOFFにすることによりSCRIPTなどの挿入を防ぐちょっとしたXSS対策。
   * @return {Subscription}
   * @memberof WebpageUpdateComponent
   */
  public onSubmit(): Subscription {
    if (this.isSourceEditingMode) {
      this.isSourceEditingMode = false;
    }

    return this._subscription.add(
      timer$(100)
        .pipe(take(1))
        .subscribe(() => super.onSubmit())
    );
  }

  /**
   *
   *
   * @param {CKEditor5.Editor} editor
   * @memberof WebpageUpdateComponent
   */
  public onReady(editor: CKEditor5.Editor): void {
    this.uploadAdapterPlugin(editor);
  }

  /**
   *
   * @description `<ckeditor formControlName="content"...`だと画像のアップロードが正常に動作しない。これはckeditor側のバグなので一旦別の対応を行う。
   * @param {(ChangeEvent | Event)} $event
   * @memberof WebpageUpdateComponent
   */
  public onEditorChange($event: ChangeEvent | Event): void {
    let value: string;
    const editor: CKEditor5.Editor = _.get($event, 'editor');
    if (editor) {
      value = editor.getData();
    }

    // source editing mode does not have editor.
    const target: HTMLTextAreaElement = _.get($event, 'target');
    if (target) {
      value = target.value;
    }

    const ctrl: AbstractControl = this.getFormCtrl('content');
    ctrl.patchValue(value);
    ctrl.markAsDirty();
    ctrl.markAsTouched();
    this._changeDetectorRef.markForCheck();
  }

  /**
   * @example `(blur)="onEditorBlur($event)"`
   * @description but source editing mode does not work
   * @param {(BlurEvent | Event)} $event
   * @memberof WebpageUpdateComponent
   */
  public onEditorBlur($event: BlurEvent | Event): void {}

  /**
   *
   *
   * @private
   * @description ソース編集モードを取得する。
   * @memberof WebpageUpdateComponent
   */
  private get isSourceEditingMode(): boolean {
    try {
      return this.$editor.editorInstance.plugins.get('SourceEditing')
        .isSourceEditingMode;
    } catch (e) {
      return false;
    }
  }

  /**
   *
   *
   * @private
   * @description ソース編集モードを設定する。
   * @memberof WebpageUpdateComponent
   */
  private set isSourceEditingMode(isSourceEditingMode: boolean) {
    try {
      this.$editor.editorInstance.plugins.get(
        'SourceEditing'
      ).isSourceEditingMode = isSourceEditingMode;
    } catch (e) {}
  }
}
