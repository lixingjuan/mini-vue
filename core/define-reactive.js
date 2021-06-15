// import { observe } from './observe.js';

/**
 * 重写对象的 get/set
 * 从而实现在 访问/设置 做依赖收集/派发更新
 */
function defineReactive(obj, key) {
  const property = Object.getOwnPropertyDescriptor(obj, key);
  obj.testtest = 'test';
  if (!property.configurable) {
    return;
  }

  // let childObj = observe(obj[key]);

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
      // console.log(this.name)
      console.log('访问get');
      // 在get 收集依赖

      return tempVal;
    },
    set: function reactiveSetter(newVal) {
      console.log('访问set');
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      console.log(newVal);
      // childObj = observe(newVal);

      if (setter) {
        setter.call(obj, newVal);
      } else {
        tempVal = newVal;
        console.log({ tempVal });
      }

      //
      /**
       * TODO: 这边应该是根据diff的结果，去更新一小片的dom, 但是目前没有做diff处理，所以就更新所有dom
       * 即相当于调用 render,
       * 另外，update 更新应该是发布者-Watcher 通知所有的订阅者，但是现在还没写Watcher, 所以直接粗暴的使用window上的render
       */
      window.app.render();
    },
  });
}

export { defineReactive };
