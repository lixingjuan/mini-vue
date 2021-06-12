/**
 * 重写对象的 get/set
 * 从而实现在 访问/设置 做依赖收集/派发更新
 */
function defineReactive(obj, key) {
  const property = Object.getOwnPropertyDescriptor(obj, key);

  if (!property.configurable) {
    return;
  }

  const { value } = property;

  // const getter = property && property.get;
  // const setter = property && property.set;

  /**
   * 实现响应式的核心:
   * Object.defineProperty
   * 该方法可以支持自定义对象的 get 和 set 方法
   */
  let tempVal = value;

  Object.defineProperty(obj, 'name', {
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
      tempVal = newVal;
      // 在set 派发更新
    },
  });
}

/**
 * @des 观察者 - 重新定义对象的 getter/setter
 * @param {Array | *}
 * @return {Observer}
 */
export class Observer {
  constructor(value) {
    this.value = value;
    if (Array.isArray(value)) {
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
   * 观察数组项的列表。
   */
  observeArray(items) {
    items.forEach((it) => {
      new Observer(it);
    });
  }
}

export { defineReactive };
