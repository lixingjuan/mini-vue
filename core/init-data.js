import { getVNode, parseVNode } from "./vnode.js";

/**
 * @des 将 某一个对象的属性 访问 映射到 对象的某一个属性成员上
 * @param {*} target
 * @param {*} prop
 * @param {*} key
 * @return {*}
 */
function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      // eg. this.name => this._data.name,
      return target[prop][key];
    },
    set(newVal) {
      // eg. this.name => this._data.name
      target[prop][key] = newVal;
    },
  });
}

export { parseVNode, getVNode };
