import Observer from '../observe.js';
import { getVNode, parseVNode } from '../vnode.js';
import { compiler } from '../compiler.js';

/**
 * Vue原型
 * new MiniVue 的时候，执行render,
 * render 时执行 compiler
 */

/**
 * @des 使得访问 this.data 就可以访问到 this._data, (prop同)，数据的代码
 * @param {Object} MiniVue
 * @return {*} void
 */
export default function initRender(MiniVue) {
  /**
   * @des 更新 - 将虚拟 DOM 渲染到页面中: diff 算法就在里（此版本mini-vue没做diff两次vnode对比）
   * @param {*} vnode
   * @return {*}
   */

  MiniVue.prototype.render = function () {
    // this._data = this.options.data;
    // 准备工作 ( 准备模板 )
    // this._el = this.options.el;
    // this._templateDOM = document.querySelector(this._el);
    // this._parent = this._templateDOM.parentNode;
    console.log('this._data', this._data);
    new Observer(this._data);

    const realHTMLVNode = this.$templateDOM.cloneNode(true);
    console.log('this._data', this._data);
    compiler(realHTMLVNode, this._data);

    this.mount(getVNode(realHTMLVNode));
    console.log('getVNode(realHTMLVNode)', getVNode(realHTMLVNode));
  };

  MiniVue.prototype.mount = function (vnode) {
    const realDOM = parseVNode(vnode);
    console.log('parseVNode(realHTMLVNode)', realDOM);

    this.$parent.replaceChild(realDOM, document.querySelector(this._el));
  };
}
