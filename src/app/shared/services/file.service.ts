import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { Observable, from as fromPromise$ } from 'rxjs';
import { take, concatMap } from 'rxjs/operators';
import { ApiService } from '@shared/services/api.service';
import { IFile } from '@shared/interfaces';
import { BaseRestService } from '@core/class/base-rest.service';

/**
 *
 *
 * @export
 * @class FileService
 * @extends {BaseRestService}
 * @implements {OnDestroy}
 */
@Injectable({
  providedIn: 'root',
})
export class FileService extends BaseRestService<IFile> implements OnDestroy {
  /**
   *
   *
   * @type {string}
   * @memberof FileService
   */
  public endpoint: string = 'files';

  /**
   *Creates an instance of FileService.
   * @param {ApiService} _apiSvc
   * @memberof FileService
   */
  public constructor(@Inject(ApiService) protected _apiSvc: ApiService) {
    super(_apiSvc);
  }

  /**
   *
   *
   * @return {Observable<IFile>}
   * @memberof FileService
   */
  public upload$(file: File): Observable<IFile> {
    const url: string = `${environment.api.endpoint.api}/${this.endpoint}`;
    return this.fromFile$(file).pipe(
      concatMap((payload: IFile) => this._apiSvc.post<IFile>(url, payload))
    );
  }

  /**
   *
   *
   * @param {File} file
   * @return {Observable<IFile>}
   * @memberof FileService
   */
  public fromFile$(file: File): Observable<IFile> {
    return fromPromise$(
      new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();
        reader.onerror = () => reject(new Error('Failed to upload a file'));
        reader.onload = () =>
          resolve({
            name: file.name,
            size: file.size,
            type: file.type,
            blob: reader.result,
          });
        reader.readAsDataURL(file);
      })
    ).pipe(take(1));
  }
}
