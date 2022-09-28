import { NgZone, OnDestroy, Injectable } from '@angular/core';
import { _, Util } from '@core/class/util';
import { Observable, BehaviorSubject, fromEvent as fromEvent$ } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BaseService } from '@core/class/base.service';

/**
 *
 *
 * @export
 * @class StorageService
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {Storage}
   * @memberof StorageService
   */
  private _storage: Storage = window.localStorage;

  /**
   *
   *
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof StorageService
   */
  private _changeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   *
   *
   * @type {Observable<boolean>}
   * @memberof StorageService
   */
  public change$: Observable<boolean> = this._changeSubject
    .asObservable()
    .pipe(filter((changed: boolean) => changed));

  /**
   *Creates an instance of StorageService.
   * @memberof StorageService
   */
  public constructor(private _ngZone: NgZone) {
    super();
    this._ngZone.runOutsideAngular(() =>
      fromEvent$(window, 'storage')
        .pipe(
          filter(($event: StorageEvent) => $event.storageArea === this._storage)
        )
        .subscribe(() => this._ngZone.run(() => this._changeSubject.next(true)))
    );
  }

  /**
   *
   *
   * @memberof StorageService
   */
  public ngOnDestroy() {
    super.ngOnDestroy();
    this._changeSubject.complete();
  }

  /**
   *
   *
   * @param {number} idx
   * @returns {string}
   * @memberof StorageService
   */
  public key(idx: number): string {
    return this._storage.key(idx);
  }

  /**
   *
   *
   * @returns {string[]}
   * @memberof StorageService
   */
  public keys(): string[] {
    const keys: string[] = [];
    const size = _.size(this._storage);
    for (let i = 0; i < size; i++) {
      const k: string = this.key(i);
      if (!_.isNull(k)) {
        keys.push(k);
      }
    }

    return keys;
  }

  /**
   *
   *
   * @param {string} key
   * @returns {any}
   * @memberof StorageService
   */
  public get(key: string): any {
    return Util.fromJson(this._storage.getItem(key));
  }

  /**
   *
   *
   * @param {string} key
   * @param {*} value
   * @memberof StorageService
   */
  public set(key: string, value: any): void {
    this._storage.setItem(key, Util.toJson(value));
    this._changeSubject.next(true);
  }

  /**
   *
   *
   * @param {string} key
   * @memberof StorageService
   */
  public remove(key: string): void {
    this._storage.removeItem(key);
    this._changeSubject.next(true);
  }

  /**
   *
   *
   * @memberof StorageService
   */
  public clear(): void {
    this._storage.clear();
    this._changeSubject.next(true);
  }
}
