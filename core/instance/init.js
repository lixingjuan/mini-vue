import { initState } from "./init-state.js";

let uid = 0;

export default function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;

    vm._uid = uid++;
    vm._data = options.data;
    this._el = options.el;

    // 准备工作 ( 准备模板 )
    vm._templateDOM = document.querySelector(this._el);
    vm._parent = this._templateDOM.parentNode;
    window.vm = vm;
    let startTag, endTag;

    vm.$options = options;

    initState(vm);

    if (vm.$options.el) {
      vm.$mount(vm);
    }
  };
}
