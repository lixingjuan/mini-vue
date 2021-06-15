// import Observer from './observe.js';

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

// import { def } from '../util/index'
const arrayProto = Array.prototype;

const arrayMethods = Object.create(arrayProto);

const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
];

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach((method) => {
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment(target) {
  const hasProto = '__proto__' in {};
  if (hasProto) {
    target.__proto__ = arrayMethods;
  } else {
    copyAugment(target);
  }
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
function copyAugment(target) {
  for (let i = 0, l = arrayKeys.length; i < l; i++) {
    const key = arrayKeys[i];
    console.log('ceee', arrayKeys[key]);
    def(target, key, arrayKeys[key]);
  }
}

export { protoAugment };
