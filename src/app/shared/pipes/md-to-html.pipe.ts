import {
  Pipe,
  PipeTransform,
  Sanitizer,
  SecurityContext,
  Inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as Marked from 'marked';
import { Renderer, MarkedOptions } from 'marked';

/**
 * @usage `[innerHTML]="text|mdToHtml"`
 * @see https://qiita.com/daikiojm/items/e02e2aeb0231b3620a0b
 * @export
 * @class MdToHtmlPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'mdToHtml',
})
export class MdToHtmlPipe implements PipeTransform {
  /**
   *Creates an instance of MdToHtmlPipe.
   * @param {DomSanitizer} _domSanitizer
   * @memberof MdToHtmlPipe
   */
  public constructor(
    @Inject(DomSanitizer) private _domSanitizer: DomSanitizer // @Inject(Sanitizer) private _sanitizer: Sanitizer
  ) {}

  /**
   *
   *
   * @private
   * @param {string} md
   * @param {*} [args]
   * @returns {SafeHtml}
   * @memberof MdToHtmlPipe
   */
  private mdToHtml(md: string, args?: any): SafeHtml {
    const renderer: Renderer = new Renderer();
    const { link }: any = renderer;
    renderer.link = (href: string, title: string, text: string) => {
      const html: string = `${link.call(renderer, href, title, text)}`;
      if (`${href}`.startsWith('http://') || `${href}`.startsWith('https://')) {
        return html.replace(/^<a /, `<a target="_blank" rel="nofollow" `);
      }

      return html;
    };
    const options: MarkedOptions = {
      renderer,
      breaks: true,
      mangle: true,
      sanitize: true,
      sanitizer: (html: string) =>
        `${this._domSanitizer.sanitize(SecurityContext.HTML, html)}`,
    };

    return this._domSanitizer.bypassSecurityTrustHtml(
      Marked(md, options)
    ) as SafeHtml;
  }

  /**
   *
   *
   * @param {string} value
   * @param {*} [args]
   * @returns {string}
   * @memberof MdToHtmlPipe
   */
  public transform(value: string, args?: any): SafeHtml | string {
    if (value) {
      return this.mdToHtml(value, args);
    }

    return value;
  }
}
