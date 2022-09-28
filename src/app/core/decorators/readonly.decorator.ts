// tslint:disable:only-arrow-functions
/**
 *
 *
 * @export
 * @param {*} target
 * @param {string} key
 * @param {PropertyDescriptor} descriptor
 * @returns {PropertyDescriptor}
 */
export function Readonly(
  target: any,
  key: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  descriptor.writable = false;
  return descriptor;
}
