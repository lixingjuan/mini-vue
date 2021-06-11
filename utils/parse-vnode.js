function parseVnode(vnode) {
  console.log({ vnode });
  const { tag, data: attrsArr, type, value, children } = vnode;

  let _ele = null;

  if (tag) {
    _ele = document.createElement(tag);
  } else {
    _ele = document.createTextNode(value);
    _ele.textContent === value;
  }

  _ele.nodeType === type;

  if (!children && attrsArr) {
    for (const key of attrsArr) {
      const value = attrsArr[key];
      _ele.setAttribute(key, value);
    }
  }

  if (children) {
    children.forEach((it) => {
      const childEle = parseVnode(it);
      console.log(_ele.appentChild);
      _ele.appendChild(childEle);
    });
  }

  return _ele;
}

export { parseVnode };
