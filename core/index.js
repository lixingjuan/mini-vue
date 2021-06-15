// import { optionsMixin, stateMixin, renderMixin } from './instance/index.js';

// function MiniVue(options) {
//   this._init(options);
//   window.vm = this;
//   console.log('cee', this.name);

//   window.testThis = this;
// }

// optionsMixin(MiniVue);
// stateMixin(MiniVue);
// renderMixin(MiniVue);
import { Observer } from './define-reactive.js';
import { initData, parseVNode, getVNode } from './init-data.js';
import { Watcher } from './Watcher.js';

/**
 * @des 根据 根据vnode 进行值 的替换
 * @param {*} template
 * @param {*} data
 */
function compiler(template, data) {
  const reg = /\{\{(.*)\}\}/g;

  let childNodes = template.childNodes; // 取出子元素

  for (let i = 0; i < childNodes.length; i++) {
    let type = childNodes[i].nodeType; // 1 元素, 3 文本节点

    if (type === 3) {
      let txt = childNodes[i].nodeValue;

      txt = txt.replace(reg, function (_, slotVar) {
        let key = slotVar.trim(); // 写在双花括号里面的 东西是变量名
        let value = data[key];
        return value;
      });

      // 注意:  txt 现在和 DOM 元素是没有关系
      childNodes[i].nodeValue = txt;
    } else if (type === 1) {
      compiler(childNodes[i], data);
    }
  }
}

/**
 * Vue原型
 * new MiniVue 的时候，执行render,
 * render 时执行 compiler
 */
function MiniVue(options) {
  this._data = options.data;
  this._el = options.el;

  initData.bind(this)();

  // 准备工作 ( 准备模板 )
  this._templateDOM = document.querySelector(this._el);
  this._parent = this._templateDOM.parentNode;

  window.vm = this;

  new Observer(this._data);

  // 渲染工作
  new Watcher(this, this.render);
}

MiniVue.prototype.render = function () {
  const realHTMLVNode = this._templateDOM.cloneNode(true);
  compiler(realHTMLVNode, this._data);

  this.update(getVNode(realHTMLVNode));
};

/**
 * @des 更新 - 将虚拟 DOM 渲染到页面中: diff 算法就在里（此版本mini-vue没做diff两次vnode对比）
 * @param {*} vnode
 * @return {*}
 */
MiniVue.prototype.update = function (vnode) {
  const realDOM = parseVNode(vnode);
  this._parent.replaceChild(realDOM, document.querySelector(this._el));
};

export default MiniVue;
