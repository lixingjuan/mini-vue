import { observe } from "./observe.js";

import { Dep } from "./dep.js";
/**
 * 重写对象的 get/set
 * 从而实现在 访问/设置 做依赖收集/派发更新
 */
function defineReactive(obj, key, val, customSetter, shallow) {
  const dep = new Dep();

  // 用来调试
  dep.___$propname__ = key;

  const property = Object.getOwnPropertyDescriptor(obj, key);

  if (!property?.configurable) {
    return;
  }

  const { value } = property;

  // const getter = property && property.get;
  const setter = property && property.set;

  /**
   * 实现响应式的核心:
   * Object.defineProperty
   * 该方法可以支持自定义对象的 get 和 set 方法
   */
  let tempVal = value;

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log("依赖收集之前的dep", dep);
      // 依赖收集
      dep.depend();
      if (Array.isArray(value)) {
        dependArray(value);
      }
      return tempVal;
    },
    set: function reactiveSetter(newVal) {
      console.log("访问set");
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      console.log(newVal);
      // childObj = observe(newVal);

      // if (setter) {
      //   setter.call(obj, newVal);
      // } else {
      //   tempVal = newVal;
      //   console.log({ tempVal });
      // }
      tempVal = newVal;

      //
      /**
       * TODO: 这边应该是根据diff的结果，去更新一小片的dom, 但是目前没有做diff处理，所以就更新所有dom
       * 即相当于调用 render,
       */

      // 派发更新, 找到全局的 watcher, 调用 update
      dep.notify();
    },
  });
}

export { defineReactive };
