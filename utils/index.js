/**
 * @des 判断是否是对象
 * @param {*} obj
 * @return {boolean}
 */

export function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

/**
 * @des Perform no operation.
 */
export function noop() {}

/**
 * @des 检查对象是否有该属性
 * @param {Object | Array<*>} obj
 * @param {string} key
 * @return {boolean}
 */
export function hasOwn(obj, key) {
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  return hasOwnProperty.call(obj, key);
}

/**
 * @des Define a property.
 * @param {Object} obj
 * @param {string} key
 * @param {*} val
 * @param {boolean} enumerable
 * @return {*}
 */
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}
