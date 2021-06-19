import { pushTarget, popTarget } from "./dep.js";

/**
 * 用于标识 Watcher
 */
let watcherid = 0;

/**
 * 观察者解析表达式，收集依赖项，
 * 并在表达式值更改时触发回调。
 * 这用于 $watch() api 和指令。
 */
export class Watcher {
  /**
   * @param {Object} vm MiniVue 实例
   * @param {String|Function} expOrfn 如果是渲染 watcher, 传入的就是渲染函数, 如果是 计算 watcher 传入的就是路径表达式, 暂时只考虑 expOrFn 为函数的情况.
   */
  constructor(vm, expOrfn) {
    this.vm = vm;
    this.getter = expOrfn;
    this.id = watcherid++;

    this.deps = []; // 依赖项
    this.depIds = new Set(); // 是一个 Set 类型, 用于保证 依赖项的唯一性 ( 简化的代码暂时不实现这一块 )

    // 一开始需要渲染: 真实 vue 中: this.lazy ? undefined : this.get()
    this.get();
  }

  /**
   * 计算, 触发 getter
   */
  get() {
    /**
     * 将当前的Watcher 放进全局的 Dep.target
     * 这样，之后触发依赖收集的时候，就会将 Dep.target 和被访问的dep, 建立双向关联，互相引用
     */
    pushTarget(this);

    /**
     * 执行render
     * 1. template 解析, 获取template 中的 {{ 变量 }} 中的变量
     * 2. 然后就会依次访问每个变量的值,
     * 3. 变量被访问就会触发 get,(definedReative 函数)
     * 4. definedReative为每个变量的 get 重新定义，每个变量都拥有一个dep,
     * 5. 在变量的 get 中，执行依赖收集， 即，调用Dep.depend方法，将当前 this 放进全局的 Dep.target的deps中
     * @return {*}
     */
    this.getter.call(this.vm, this.vm);

    popTarget();
  }

  /**
   * 执行, 并判断是懒加载, 还是同步执行, 还是异步执行:
   * 我们现在只考虑 异步执行 ( 简化的是 同步执行 )
   */
  run() {
    this.get();
    // 在真正的 vue 中是调用 queueWatcher, 来触发 nextTick 进行异步的执行
  }

  /**
   * 对外公开的函数, 用于在 属性发生变化时触发的接口
   */
  update() {
    this.run();
  }

  /**
   * 清空依赖队列
   *
   */
  cleanupDep() {
    this.deps = [];
  }

  /**
   * 将 当前的 dep 与 当前的 watcher 关联
   */
  addDep(dep) {
    const id = dep.id;
    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      this.deps.push(dep);
    }
  }
}
