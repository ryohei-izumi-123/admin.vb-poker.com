import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  Validators,
  AbstractControl,
  FormControl,
  FormGroup,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of as of$ } from 'rxjs';
import { take, tap, map, catchError, finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppValidator } from '@core/class/app-validator';
import { ICategory, IFile } from '@shared/interfaces';
import {
  ImgService,
  FileService,
  CategoryService,
  ValidateService,
  ToasterService,
} from '@shared/services';
import { BaseUpdateComponent } from '@core/class/base-update.component';
import { _ } from '@core/class/util';

/**
 *
 *
 * @export
 * @class CategoryUpdateComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'admin-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryUpdateComponent
  extends BaseUpdateComponent<ICategory, CategoryService>
  implements OnInit, OnDestroy, AfterViewInit {
  /**
   *
   *
   * @protected
   * @type {string}
   * @memberof CategoryUpdateComponent
   */
  protected _modelName: string = 'categories';

  /**
   *
   *
   * @type {ElementRef}
   * @memberof CategoryUpdateComponent
   */
  @ViewChild('$file', { static: false })
  public $file: ElementRef;

  /**
   *
   *
   * @type {string}
   * @memberof CategoryUpdateComponent
   */
  public validFileTypes: string = 'image/*,images/*';

  /**
   * Creates an instance of CategoryUpdateComponent.
   * @param {FileService} _fileSvc
   * @param {TranslateService} _translateSvc
   * @param {ValidateService} _validateSvc
   * @param {ToasterService} _toasterSvc
   * @param {ImgService} _imgSvc
   * @param {CategoryService} _categorySvc
   * @param {ActivatedRoute} _route
   * @param {Router} _router
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @memberof CategoryUpdateComponent
   */
  public constructor(
    private _fileSvc: FileService,
    protected _translateSvc: TranslateService,
    protected _validateSvc: ValidateService,
    protected _toasterSvc: ToasterService,
    protected _imgSvc: ImgService,
    protected _categorySvc: CategoryService,
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {
    super(
      _translateSvc,
      _validateSvc,
      _toasterSvc,
      _categorySvc,
      _router,
      _route,
      _changeDetectorRef
    );
  }

  /**
   *
   *
   * @memberof CategoryUpdateComponent
   */
  public initForm(): void {
    this.form = new FormGroup({
      name: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(32),
        ])
      ),
      file: new FormControl(
        '',
        Validators.compose([
          this.hasRouteParamsId
            ? Validators.nullValidator
            : Validators.required,
          AppValidator.isValidFile,
          AppValidator.isValidFileSize(),
          AppValidator.isValidFileExtension(),
        ])
      ),
      img: new FormControl('', Validators.compose([Validators.required])),
      status: new FormControl(null, Validators.compose([Validators.required])),
    });
    this.setAsyncValidators();
  }

  /**
   *
   * @deprecated
   * @description onChangeイベントでbase64に変換する方式は一旦廃止。データサイズがでかくなるため。
   * @param {Event} $event
   * @memberof CategoryUpdateComponent
   */
  public onFileChanged($event: Event): void {
    const [file]: File[] = this.getFormCtrl('file').value;
    this._subscription.add(
      this._imgSvc
        .toBase64(file)
        .pipe(take(1))
        .subscribe((base64: string) => {
          this.getFormCtrl('img').patchValue(base64);
          this._changeDetectorRef.markForCheck();
        })
    );
  }

  /**
   *
   *
   * @protected
   * @memberof CategoryUpdateComponent
   */
  protected setAsyncValidators(): void {
    this.validateName$();
    this.validateFile$();
  }

  /**
   *
   *
   * @memberof CategoryUpdateComponent
   */
  public validateName$(): void {
    const ctrl: AbstractControl = this.getFormCtrl('name');
    const validators = [this.validateIsUnique$('name')];

    this.resetAsyncValidator(ctrl);
    this.setAsyncValidator(ctrl, validators);
  }

  /**
   *
   *
   * @memberof CategoryUpdateComponent
   */
  public validateFile$(): void {
    const ctrl: AbstractControl = this.getFormCtrl('file');
    const validators = [this.validateFileWithUpload$(this.getFormCtrl('img'))];

    this.resetAsyncValidator(ctrl);
    this.setAsyncValidator(ctrl, validators);
  }

  /**
   *
   *
   * @param {AbstractControl} hiddenCtrl 画像アップロード時後、URLが返却されるのでhiddenにセットする。
   * @memberof CategoryUpdateComponent
   */
  public validateFileWithUpload$ = (
    hiddenCtrl: AbstractControl
  ): AsyncValidatorFn => {
    return (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
      if (ctrl.disabled || ctrl.pristine || _.isEmpty(ctrl.value)) {
        return of$(null);
      }

      const error: ValidationErrors = { async: true };
      const [file]: File[] = ctrl.value;

      return this._fileSvc.upload$(file).pipe(
        map((response: IFile) => {
          const url: string = _.get(response, 'url');
          const isValid: boolean = _.isEmpty(url) === false;
          if (isValid) {
            hiddenCtrl.patchValue(url);
            hiddenCtrl.updateValueAndValidity();
          }

          return isValid ? null : error;
        }),
        catchError(() => of$(error)),
        finalize(() => this._changeDetectorRef.markForCheck()),
        take(1)
      );
    };
  };
}
