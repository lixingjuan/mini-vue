/**
 * Dep 是一个 Class，它定义了一些属性和方法，
 *
 * 这里需要特别注意的是它有一个静态属性 target，这是一个全局唯一 Watcher，
 *
 * 这是一个非常巧妙的设计，因为在同一时间只能有一个全局的 Watcher 被计算，
 *
 * 另外它的自身属性 subs 也是 Watcher 的数组。
 *
 * Dep 实际上就是对 Watcher 的一种管理，Dep 脱离 Watcher 单独存在是没有意义的，
 *
 */

/**
 * 用于标识 Dep
 */
let depid = 0;

export class Dep {
  constructor() {
    this.id = depid++;

    this.subs = []; // 存储的是与 当前 Dep 关联的 watcher
  }

  /**
   * 添加一个 watcher
   */
  addSub(sub) {
    this.subs.push(sub);
  }

  /**
   * 移除
   */
  removeSub(sub) {
    const index = this.subs.findIndex((it) => it.id === sub.id);
    if (index > 0) {
      this.subs.splice(index, 1);
    }
  }

  /**
   * 将当前 Dep 与当前的 watcher ( 暂时渲染 watcher ) 关联
   */
  depend() {
    if (Dep.target) {
      // 将 当前的 watcher 关联到 当前的 dep 上
      this.addSub(Dep.target);
      // 将当前的 dep 与 当前渲染 watcher 关联起来
      Dep.target.addDep(this);
    }
  }

  /**
   * 触发与之关联的 watcher 的 update 方法, 起到更新的作用
   */
  notify() {
    const deps = this.subs.slice();
    deps.forEach((watcher) => {
      watcher.update();
    });
  }
}

/**
 * 全局的容器存储渲染 Watcher
 */
Dep.target = null;

const targetStack = [];

/**
 * @des 将当前操作的 watcher 存储到 全局 watcher 中, 参数 target 就是当前 watcher
 * @param {*} target
 * @return {*}
 */
export function pushTarget(_target) {
  if (Dep.target) {
    targetStack.push(Dep.target);
  }
  console.log(targetStack);
  Dep.target = _target;
  console.log("pushTarget Dep.target", Dep.target);
}

/**
 * 将 当前 watcher 从 执行栈 移出
 */
export function popTarget() {
  console.log("targetStack", targetStack);
  Dep.target = targetStack.shift(); // 踢到最后就是 undefined
}

/**
 * 在 watcher 调用 get 方法的时候, 调用 pushTarget( this )
 * 在 watcher 的 get 方法结束的时候, 调用 popTarget()
 */
