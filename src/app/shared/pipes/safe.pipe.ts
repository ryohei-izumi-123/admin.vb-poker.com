import { Inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TSafe, TSafeType } from '@shared/types';

/**
 *
 * @usage `[innerHTML]="text|safe"`
 * @export
 * @class SafePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'safe',
})
export class SafePipe implements PipeTransform {
  /**
   *Creates an instance of SafePipe.
   * @param {DomSanitizer} _domSanitizer
   * @memberof SafePipe
   */
  public constructor(
    @Inject(DomSanitizer) private _domSanitizer: DomSanitizer
  ) {}

  /**
   *
   *
   * @param {string} value
   * @param {TSafeType} args
   * @returns {TSafe}
   * @memberof SafePipe
   */
  public transform(value: string, args: TSafeType): TSafe {
    switch (args) {
      case 'html':
        return this._domSanitizer.bypassSecurityTrustHtml(value);

      case 'style':
        return this._domSanitizer.bypassSecurityTrustStyle(value);

      case 'script':
        return this._domSanitizer.bypassSecurityTrustScript(value);

      case 'url':
        return this._domSanitizer.bypassSecurityTrustUrl(value);

      case 'resourceUrl':
        return this._domSanitizer.bypassSecurityTrustResourceUrl(value);

      default:
        throw new Error(`Invalid safe type specified: ${args}`);
    }
  }
}
