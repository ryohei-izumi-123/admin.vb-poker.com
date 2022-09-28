import { environment } from '@env/environment';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  Observable,
  throwError as throwError$,
  from as fromPromise$,
} from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import {
  createClient,
  CreateClientParams,
  ClientLogLevel,
  Asset,
  AssetCollection,
  ContentType,
  ContentTypeCollection,
  Entry,
  EntryCollection,
  Space,
  LocaleCollection,
  Tag,
  TagCollection,
  SyncCollection,
  ContentfulClientApi,
} from 'contentful';
import { _ } from '@core/class/util';
import { BaseService } from '@core/class/base.service';
import { LoggerService } from '@shared/services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class ContentfulService extends BaseService implements OnDestroy {
  /**
   *
   *
   * @private
   * @type {ContentfulClientApi}
   * @memberof ContentfulService
   */
  private _client: ContentfulClientApi = null;

  /**
   * Creates an instance of ContentfulService.
   * @param {LoggerService} _loggerSvc
   * @memberof ContentfulService
   */
  public constructor(@Inject(LoggerService) private _loggerSvc: LoggerService) {
    super();
    this.init();
  }

  /**
   *
   *
   * @return {void}
   * @memberof ContentfulService
   */
  public init(): void {
    const logHandler: (
      level: ClientLogLevel,
      data?: any
    ) => void = this._loggerSvc.log.bind(this._loggerSvc);
    const options: Omit<CreateClientParams, 'space' | 'accessToken'> = {
      logHandler,
    };
    const payload: CreateClientParams = _.assign(
      _.cloneDeep(environment.contentful),
      options
    );

    this._client = createClient(payload);
  }

  /**
   *
   *
   * @memberof ContentfulService
   */
  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  /**
   *
   *
   * @param {any} [query={  initial: true, limit: 1000 }]
   * @return {Observable<SyncCollection>}
   * @memberof ContentfulService
   */
  public sync$(
    query: any = { initial: true, limit: 1000 }
  ): Observable<SyncCollection> {
    return fromPromise$(this._client.sync(query)).pipe(
      map((data: SyncCollection) => data.toPlainObject() as SyncCollection),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @return {Observable<Space>}
   * @memberof ContentfulService
   */
  public getSpace$(): Observable<Space> {
    return fromPromise$(this._client.getSpace()).pipe(
      map((data: Space) => data.toPlainObject() as Space),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @return {Observable<LocaleCollection>}
   * @memberof ContentfulService
   */
  public getLocales$(): Observable<LocaleCollection> {
    return fromPromise$(this._client.getLocales()).pipe(
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {string} id
   * @return {Observable<Tag>}
   * @memberof ContentfulService
   */
  public getTag$(id: string): Observable<Tag> {
    return fromPromise$(this._client.getTag(id)).pipe(
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {any} [query={ limit: 1000 }]
   * @return {Observable<Tag[]>}
   * @memberof ContentfulService
   */
  public getTags$(query: any = { limit: 1000 }): Observable<Tag[]> {
    return fromPromise$(this._client.getTags(query)).pipe(
      map((data: TagCollection) => data.items),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {string} id
   * @return {Observable<ContentType>}
   * @memberof ContentfulService
   */
  public getContentType$(id: string): Observable<ContentType> {
    return fromPromise$(this._client.getContentType(id)).pipe(
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {any} [query={ limit: 1000 }]
   * @return {Observable<ContentType[]>}
   * @memberof ContentfulService
   */
  public getContentTypes$(
    query: any = { limit: 1000 }
  ): Observable<ContentType[]> {
    return fromPromise$(this._client.getContentTypes(query)).pipe(
      map((data: ContentTypeCollection) => data.items),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {string} id
   * @param {any} [query={}]
   * @return {Observable<Asset>}
   * @memberof ContentfulService
   */
  public getAsset$(id: string, query: any = {}): Observable<Asset> {
    return fromPromise$(this._client.getAsset(id, query)).pipe(
      map((data: Asset) => data.toPlainObject() as Asset),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @param {any} [query={}]
   * @return {Observable<Asset[]>}
   * @memberof ContentfulService
   */
  public getAssets$(query: any = {}): Observable<Asset[]> {
    return fromPromise$(this._client.getAssets(query)).pipe(
      map((data: AssetCollection) => data.items),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   *
   * @template T
   * @param {string} id
   * @param {any} [query={}]
   * @return {Observable<Entry<T>>}
   * @memberof ContentfulService
   */
  public getEntry$<T = any>(id: string, query: any = {}): Observable<Entry<T>> {
    return fromPromise$(this._client.getEntry(id, query)).pipe(
      map((data: Entry<T>) => data.toPlainObject() as Entry<T>),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   *
   * @template T
   * @param {any} [query = {}]
   * @return {Observable<Entry<T>[]>}
   * @memberof ContentfulService
   */
  public getEntries$<T = any>(query: any = {}): Observable<Entry<T>[]> {
    return fromPromise$(this._client.getEntries(query)).pipe(
      map((data: EntryCollection<T>) => data.items),
      catchError((error: Error) => throwError$(error)),
      take(1)
    );
  }

  /**
   * @example `const result = this._contentfulSvc.parseEntries(json);console.log(result);`
   * @description The type definition is incorrect. It should not be `Promise<EntryCollection<T>>`, non-Promise.
   * @param {any} [raw={}]
   * @return {any}
   * @memberof ContentfulService
   */
  public parseEntries(raw: any = {}): any {
    return this._client.parseEntries(raw);
  }
}
