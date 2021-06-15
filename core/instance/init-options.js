import { observe } from '../observe.js';
// import { proxy } from './init-state.js';

import { noop } from '../../utils/index.js';

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop,
};

/**
 * @des 使得访问 this.data 就可以访问到 this._data, (prop同)，数据的代码
 * @param {Object} target
 * @param {string} sourceKey
 * @param {string} key
 * @return {*}
 */

export function proxy(target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initData(vm) {
  // let data = vm.$options.data;

  // data = vm._data;

  Object.keys(vm._data).forEach((key) => {
    proxy(vm, `_data`, key);
  });

  // observe(data, true);
}

export default function optionsMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;

    this.$el = options.el;
    this.$options = options;
    this._el = options.el;
    this._data = options.data;
    this.$templateDOM = document.querySelector(this.$el);
    this.$parent = this.$templateDOM.parentNode;

    if (options.data) {
      initData(vm);
    } else {
      observe((vm._data = {}));
    }

    // TODO: VUE 源码这里根据不同的平台，将ast=>vnode 有不同的处理，本项目不添加ast, 直接使用 dom->vnode->dom
    if (vm.$options.el) {
      vm.render();
    }
  };
}
