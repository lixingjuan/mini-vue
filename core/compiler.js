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

export { compiler };
