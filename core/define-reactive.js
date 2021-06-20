import { observe } from "./observe.js";

import { Dep } from "./dep.js";

/**
 * 当数组被访问时收集对数组元素的依赖，因为
 * 我们不能像属性 getter 那样拦截数组元素访问。
 */
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

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

  // 获取属性描述，即 使用 definePrototype 时传入的参数
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  /**
   * 实现响应式的核心:
   * Object.defineProperty
   * 该方法可以支持自定义对象的 get 和 set 方法
   */
  let tempVal = value;

  let childOb = observe(val);

  console.log({ childOb });

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log("依赖收集之前的dep", dep);
      // 依赖收集
      dep.depend();
      // 如果是数组
      if (childOb) {
        childOb.dep.depend();
      }
      // if (Array.isArray(value)) {
      //   dependArray(value);
      // }
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
      childOb = observe(newVal);
      // 派发更新, 找到全局的 watcher, 调用 update
      dep.notify();
    },
  });
}

export { defineReactive };
