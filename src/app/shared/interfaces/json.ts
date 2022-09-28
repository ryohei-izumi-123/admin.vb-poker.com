/**
 *
 *
 * @export
 * @interface IJsonNode
 */
export interface IJsonNode {
  key: string;
  value: string;
  path: string;
  parent?: string;
  nodes?: IJsonNode[];
}
