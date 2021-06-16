import { noop } from "../../utils/index.js";
import { observe } from "../observe.js";

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

export function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

/**
 * @des 代理数据
 * @param {*}
 * @return {*}
 */
function initData(vm) {
  Object.keys(vm._data).forEach((key) => {
    proxy(vm, "_data", key);
  });

  observe(vm._data);
}

export function initState(vm) {
  vm._watchers = [];
  const opts = vm.$options;
  debugger;

  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data);
  }
}

/**
 * @des 使得访问 this.$data 就可以访问到 this._data, (prop同)，数据的代码
 * @param {MiniVue} vm
 * @return {*} void
 */
export default function stateMixin(MiniVue) {
  Object.defineProperty(MiniVue.prototype, "$data", {
    get: function () {
      return this._data;
    },
  });
}
