// import { getVNode } from "./vnode.js";

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
  // 习惯: 内部的数据使用下划线 开头, 只读数据使用 $ 开头
  this._data = options.data;
  this._el = options.el;

  // 准备工作 ( 准备模板 )
  this._templateDOM = document.querySelector(this._el);
  this._parent = this._templateDOM.parentNode;

  // 渲染工作
  this.render();
}

MiniVue.prototype.render = function () {
  const realHTMLDOM = this._templateDOM.cloneNode(true); // 用 模板 拷贝 得到 一个 准 DOM
  compiler(realHTMLDOM, this._data);
  this.update(realHTMLDOM);
};

MiniVue.prototype.update = function (real) {
  this._parent.replaceChild(real, document.querySelector(this._el));
};

export default MiniVue;
