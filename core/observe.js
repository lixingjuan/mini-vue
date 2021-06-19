import { defineReactive } from "./define-reactive.js";
import { protoAugment } from "./array.js";
import { isObject, def, hasOwn } from "../utils/index.js";
import { VNode } from "./vnode.js";

/**
 * @des 尝试为值创建观察者实例，
 * 如果成功观察到，则返回新的观察者，
 * 如果值已包含一个, 则返回现有的观察者（）
 * @param {*} value
 * @param {boolean} asRootData
 * @return {Observer | void}
 */
export function observe(value) {
  console.log("observe 收到的数据", value);

  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob;

  if (hasOwn(value, "__ob__") && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else {
    // 如果数组数组

    ob = new Observer(value);
  }

  return ob;
}

/**
 * @des 观察者 - 重新定义对象的 getter/setter
 * @param {Array | *}
 * @return {Observer}
 */
export default class Observer {
  constructor(value) {
    this.value = value;

    def(value, "__ob__", this);

    console.log("Observer", value);

    // TODO: 数组
    if (Array.isArray(value)) {
      // value.__proto__ =
      protoAugment(value);
      // 重写数组的方法，同时将数组的每个元素都变为响应式
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  /**
   * 遍历所有属性并将它们转换为getter / setter。
   * 仅当值类型为Object时才应调用此方法
   */
  walk(obj) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      defineReactive(obj, key);
    });
  }

  /**
   * 观察数组项的列表, 将数组新增的元素变成响应式
   * 新增元素的数组方法，push, unshift
   */
  observeArray(items) {
    items.forEach((it) => {
      observe(it);
    });
  }
}
