import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of as of$, from as fromPromise$ } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';
import { BaseService } from '@core/class/base.service';

/**
 *
 * @export
 * @class ImgService
 */
@Injectable({
  providedIn: 'root',
})
export class ImgService extends BaseService implements OnDestroy {
  /**
   * Creates an instance of ImgService.
   * @memberof ImgService
   */
  public constructor() {
    super();
  }

  /**
   *
   *
   * @param {File} file
   * @return {Observable<string>}
   * @memberof ImgService
   */
  public toBase64(file: File): Observable<string> {
    return fromPromise$(
      new Promise((resolve, reject) => {
        const reader: FileReader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (e) => reject(e);
      })
    ).pipe(
      catchError(() => of$(undefined)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {string} base64
   * @return {Observable<string>}
   * @memberof ImgService
   */
  public toBlob(base64: string): Observable<string> {
    const source$: Promise<Response> = fetch(base64);

    return fromPromise$(source$).pipe(
      map((response: Response) => response.blob()),
      catchError(() => of$(undefined)),
      take(1)
    );
  }
}
