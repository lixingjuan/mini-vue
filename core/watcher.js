import { pushTarget, popTarget } from './dep.js';

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
    pushTarget(this);

    this.getter.call(this.vm, this.vm); // 上下文的问题就解决了

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
