/**
 *
 *
 * @export
 * @interface ICsvOptions
 */
export interface ICsvOptions {
  filename?: string;
  title?: string;
  fieldSeparator?: string;
  quoteStrings?: string;
  decimalseparator?: string;
  showLabels?: boolean;
  showTitle?: boolean;
  useBom?: boolean;
  noDownload?: boolean;
  headers?: string[];
}
