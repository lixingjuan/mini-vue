/**
 * @des 判断是否是对象
 * @param {*} obj
 * @return {boolean}
 */

export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

/**
 * 获取一个值的原始类型字符串，例如，[object Object]。
 */
export const _toString = Object.prototype.toString;

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

/**
 * @des Define a property.
 * @param {*} obj
 * @return {*} string
 */
export function toString(val) {
  let tempVal = val;
  if (val === null) {
    tempVal = "";
  } else if (
    Array.isArray(val) ||
    (isPlainObject(val) && val.toString === _toString)
  ) {
    tempVal = JSON.stringify(val, null, 2);
  } else {
    tempVal = String(val);
  }

  return tempVal;
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject(obj) {
  return _toString.call(obj) === "[object Object]";
}
