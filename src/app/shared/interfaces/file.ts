/**
 *
 *
 * @export
 * @interface IFile
 */
export interface IFile {
  name?: string;
  size?: number;
  type?: string;
  blob?: string | Blob;
  url?: string;
}
