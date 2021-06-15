/**
 * 将真实DOM转为虚拟DOM
 * @param {*} tag dom名称 div/p 等
 * @param {*} data dom 上的属性，class, style 等
 * @param {*} value dom中间的内容，eg. <div>hahaha</div>, value 即为hahaha
 * @param {number} type  即nodeType 1: 元素节点/3： 文本节点
 */
class VNode {
  constructor(tag, data, value, type) {
    this.tag = tag && tag.toLowerCase();
    this.data = data;
    this.value = value;
    this.type = type;
    this.children = [];
  }

  appendChild(vnode) {
    this.children.push(vnode);
  }
}

/**
 * @des 根据真实dom, 得到一个vnode对象
 * @param {node} 真实dom
 * @return {vnode} vnode对象
 */
function getVNode(node) {
  const nodeType = node.nodeType;
  // 文本节点
  const isTextNode = nodeType === 3;
  // 元素节点
  const isElementNode = nodeType === 1;

  if (isElementNode) {
    const nodeName = node.nodeName;
    const attrs = [...node.attributes];
    // 属性对象
    const _attrObj = {};
    attrs.forEach((it) => {
      Object.assign(_attrObj, {
        [it.nodeName]: it.nodeValue,
      });
    });

    let _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

    // 考虑 node 的子元素
    const childNodes = node.childNodes;

    childNodes.forEach((it) => {
      _vnode.children.push(getVNode(it)); // 递归
    });

    return _vnode;
  }

  if (isTextNode) {
    return new VNode(undefined, undefined, node.nodeValue, nodeType);
  }

  return null;
}

/**
 * @des 将虚拟dom, vnode 解析为真实的dom
 * @param {vnode} vnode对象
 * @return {node} 真实dom
 */
function parseVNode(vnode) {
  const { tag, data: attrsArr, type, value, children } = vnode;

  let _node = null;

  if (type === 3) {
    return document.createTextNode(value); // 创建文本节点
  } else if (type === 1) {
    _node = document.createElement(tag);

    // 属性
    Object.keys(attrsArr).forEach((key) => {
      let attrName = key;
      let attrValue = attrsArr[key];
      _node.setAttribute(attrName, attrValue);
    });

    children.forEach((subvnode) => {
      const childEle = parseVNode(subvnode);
      _node.appendChild(childEle); // 递归转换子元素 ( 虚拟 DOM )
    });

    return _node;
  }
}

export { getVNode, parseVNode, VNode };
