import { initMixin, stateMixin, renderMixin } from "./instance/index.js";
import { Watcher } from "./Watcher.js";

/**
 * Vue原型
 * new MiniVue 的时候，执行render,
 * render 时执行 compiler
 */
function MiniVue(options) {
  this._init(options);
}

export function mountComponent(vm, el) {
  new Watcher(vm, this.render);
}

MiniVue.prototype.$mount = mountComponent;

initMixin(MiniVue);
stateMixin(MiniVue);
renderMixin(MiniVue);

export default MiniVue;
