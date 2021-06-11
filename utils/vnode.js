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

export { getVNode, VNode };
