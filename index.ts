/*
 * @desc:
 */
const sourceObj = {
  name: 'lixingjuan',
}

function defineReactive(obj, key) {
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (!property.configurable) {
    return
  }

  const { value } = property

  const getter = property && property.get
  const setter = property && property.set

  /**
   * 实现响应式的核心:
   * Object.defineProperty
   * 该方法可以支持自定义对象的 get 和 set 方法
   */
  let tempVal = value

  const a = 1

  Object.defineProperty(obj, 'name', {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      // console.log(this.name)
      console.log('访问get')
      // 在get 收集依赖

      return tempVal
    },
    set: function reactiveSetter(newVal) {
      console.log('访问set')
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      tempVal = newVal
      // 在set 派发更新
    },
  })

  // obj.name
}

defineReactive(sourceObj, 'name')

console.log(sourceObj.name)
sourceObj.name = '1000'
console.log(sourceObj.name)
sourceObj.name = 'jhha'
// console.log(sourceObj.hahah)
