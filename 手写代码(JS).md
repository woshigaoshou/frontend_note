#### 一、实现 `call` 、 `apply` 和 `bind`

```js
Function.prototype.nilCall = function (context, ...args) {
  const key = Symbol(); // 生成key，避免重复
  context = context ? Object(context) : window; // 无指向时默认为window
  args = args || [];
  context[key] = this; // 实际使用隐式调用改变this指向
  const result = context[key](...args);
  delete context[key];
  return result;
}
Function.prototype.nilApply = function (context, args) {
  const key = Symbol();
  context = context ? Object(context) : window;
  args = args || [];
  context[key] = this;
  const result = context[key](...args);
  delete context[key];
  return result;
}
Function.prototype.nilBind = function (context, ...args1) {
  const key = Symbol();
  context = context ? Object(context) : window;
  args1 = args1 || [];
  context[key] = this;
  return function newFn(...args2) { // bind首次可传入参数，在调用时传入剩余的参数(柯里化)
    args2 = args2 || [];
    const args = [...args1, ...args2];
    if (this instanceof newFn) {  // new的优先级比显式绑定的高，假设newFn为bind绑定后的函数，此时执行new newFn，newFn的this会指向实例
      return new context[key](...args);
    }
    return context[key](...args);
  }
}
```

#### 二、 arguments转为数组

```js
// 1.使用数组方法
Array.prototype.slice.call(arguments, 1, arguments.length);
// 2.使用from方法
Array.from(arguments);
// 3.使用解构
[...arguments];
```

### 三、实现new

```js
function objectFactory (fn, ...args) {
  const obj = Object.create(fn.prototype);
  const result = fn.apply(obj, args);
  const flag = result && (typeof result === 'object' || typeof result === 'function');
  return flag ? result : obj;
}

function Fn (a, b) {
  this.a = a;
  this.b = b;
  this.c = 3;
}

const obj = objectFactory(Fn, 1, 2);
console.log(obj, Fn, {a:1, b: 3, c: 4})

```

### 四、防抖节流

```js
/** 防抖 */
// 1. 定时器版，非立即执行
function debounce (fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
      clearTimeout(timer);
      timer = null;
    }, delay);
  }
}
// 2. 定时器+时间戳版，立即执行
function debounce (fn, delay) {
  let last = Date.now();
  let timer = null;
  return function (...args) {
    let now = Date.now();
    if (timer) clearTimeout(timer);
    if (now - last >= delay) {
      fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        last = Date.now();
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
    last = now;
  }
}

/** 节流 */
// 1. 时间戳版，立即执行
function throttle (fn, delay) {
  let last = Date.now();
  return function (...args) {
    let now = Date.now();
    if (now - last >= delay) {
      fn.apply(this, args);
      last = now;
    }
  }
}

// 2. 定时器版，非立即执行
function throttle (fn, delay) {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        clearTimeout(timer);
        timer = null;
      }, delay);
    }
  }
}
```

### 五、发布订阅（eventBus）

```js
class EventBus {
  constructor () {
    this.eventPool = new Map();
  }
  on (type, callback) {
    if (!this.eventPool.has(type)) this.eventPool.set(type, []);
    let callbacks = this.eventPool.get(type);
    callbacks.push(callback);
  }
  cancelListen (type, callback) {
    if (!this.eventPool.has(type)) return;
    let callbacks = this.eventPool.get(type);
    const index = callbacks.findIndex(cb => cb === callback);
    callbacks.splice(index, 1);
  }
  emit (type, ...args) {
    if (!this.eventPool.has(type)) return;
    let callbacks = this.eventPool.get(type);
    callbacks.forEach(cb => cb.apply(this, args));
  }
}
```

### 六、实现Iterator

```js
// 数组迭代器
const arrIterator = function (arr) {
  let index = 0;
  return {
    next() {
      return index < arr.length
  		? { done: false, value: arr[index++] }
  		: { done: true, value: undefined };
    }
  };
};
  
// 可迭代对象，当对象具有迭代器时，使用展开运算符会优先使用迭代器，而不是类似entries的功能
const iterableObj = {
  id: 1,
  name: 'nil',
  age: 18,
  [Symbol.iterator]: function () {
    const keys = Object.keys(this);
    let index = 0;
    // 该对象是一个迭代器
    return {
      next: () => {
          return index < keys.length
        ?  { done: false, value: this[keys[index++]] }
        :  { done: true, value: undefined };
      },
      // break终止
      return: () => {
        return { done: true, value: undefined };
      }
    };
  }
};
```

### 七、实现Object.create

```js
function objCreate(obj) {
  function fn () {}
  fn.prototype = obj;
  return new fn();
}

const obj = objCreate({a: 1});
console.log(obj, obj.__proto__)
```

### 八、实现Instanceof

```js
function myInstanceOf (left, right) {
  const prototype = right.prototype;
  let proto = Object.getPrototypeOf(left);
  while (true) {
    if (!proto) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}

console.log(myInstanceOf([], Array));
console.log(myInstanceOf([], Object))

```

### 九、实现promise

```js
class nilPromise {
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  constructor (executor) {
    if (typeof executor !== 'function') {
      throw new Error(`Promise resolve ${exector} is not a function`)
    }
    this.status = nilPromise.PENDING;
    this.value = null;
    this.reason = null;
    this.onRejectedCallbacks = [];
    this.onFulfilledCallbacks = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (err) {
      this.reject(err);
    }
  }
  resolve (value) {
    if (this.status === nilPromise.PENDING) {
      queueMicrotask(() => {
        this.status = nilPromise.FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach(cb => cb());
      });
    }
  }
  reject (reason) {
    if (this.status === nilPromise.PENDING) {
      queueMicrotask(() => {
        this.status = nilPromise.REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(cb => cb());
      });
    }
  }
  then (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw(reason) };
    const promise2 = new nilPromise((resolve, reject) => {
      if (this.status === nilPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            const x = onFulfilled(this.value);
            nilPromise.resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected(this.reason);
            nilPromise.resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === nilPromise.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            nilPromise.resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        })
      } else if (this.status === nilPromise.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            nilPromise.resolvePromise(promise2, x, resolve, reject);
          } catch (err) {
            reject(err);
          }
        })
      }
    });
    return promise2;
  }
  static resolvePromise (promise2, x, resolve, reject) {
    if (promise2 === x) return reject(new TypeError('chaining cycle detected for promise'));
    if (x instanceof nilPromise) {
      if (x.status === nilPromise.PENDING) {
        x.then(y => {
          nilPromise.resolvePromise(promise2, y, resolve, reject)
        }, reject);
      } else if (x.status === nilPromise.FULFILLED) {
        resolve(x.value);
      } else if (x.status === nilPromise.REJECTED) {
        reject(x.reason);
      }
    } else if ((x !== null && typeof x === 'object') || typeof x === 'function') {
      let called = false;
      try {
        const then = x.then;
        if (typeof then === 'function') {
          then.call(x, y => {
            if (called) return;
            called = true;
            nilPromise.resolvePromise(promise2, y, resolve, reject);
          }, r => {
            if (called) return;
            called = true;
            reject(r);
          })
        } else {
          if (called) return;
          called = true;
          resolve(x);
        }
      } catch (err) {
        if (called) return;
        called = true;
        reject(err);
      }
    } else {
      resolve(x);
    }
  }
  static resolve (value) {
    if (value instanceof nilPromise) return value;
    else if (typeof value === 'object' && 'then' in value) {
      return new nilPromise((resolve, reject) => {
        value.then(resolve, reject);
      });
    }
    return new nilPromise((resolve, reject) => { resolve(value) })
  }
  static reject (reason) {
    return new nilPromise((resolve, reject) => {
      reject(reason);
    });
  }
  catch (onRejected) {
    return this.then(undefined, onRejected);
  }
  finally (callback) {
    return this.then(callback, callback);
  }
  static all (promises) {
    if (promises.length === 0) return nilPromise.resolve([]);
    return new nilPromise((resolve, reject) => {
      const result = [];
      let count = 0;
      promises.forEach((promise, index) => {
        nilPromise.resolve(promise)
          .then(res => {
            result[index] = res;
            if (++count === promises.length) resolve(result);
          })
          .catch(reason => {
            reject(reason);
          });
      });
    });
  }
  static allSettled (promises) {
    if (promises.length === 0) return nilPromise.resolve([]);
    return new nilPromise((resolve, reject) => {
      const result = [];
      let count = 0;
      promises.forEach((promise, index) => {
        nilPromise.resolve(promise)
          .then(res => {
            result[index] = {
              status: 'fulfilled',
              value: res,
            };
            if (++count === promises.length) resolve(result);
          })
          .catch(reason => {
            result[index] = {
              status: 'rejected',
              reason,
            }
            if (++count === promises.length) resolve(result);
          });
      });
    });
  }
  static race (promises) {
    if (promises.length === 0) return nilPromise.resolve([]);
    return new nilPromise(() => {
      promises.forEach((promise, index) => {
        nilPromise.resolve(promise)
          .then(resolve, reject);
      });
    });
  }
  static any (promises) {
    if (promises.length === 0) return nilPromise.resolve(new Error('All promises were rejected'));
    return new nilPromise((resolve, reject) => {
      const errors = [];
      let count = 0;
      for (const index in promises) {
        nilPromise.resolve(promises[index])
          .then(res => {
            resolve(res);
          })
          .catch(reason => {
            errors[index] = reason;
            if (++count === promises.length) resolve(errors);
          });
      }
    });
  }
}

// 测试代码
nilPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new nilPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};
module.exports = nilPromise;

```

### 十、实现柯里化

```js
function curry1 (fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(this, fn, ...args); 
}

function curry2 (fn) {
  return judge = (...args) => {
    return fn.length <= args.length ? fn(...args) : judge.bind(this, ...args); 
  }
}

function add () {
  const args = [...arguments];
  const _add = function () {
    args.push(...arguments);
    return _add;
  }
  _add._sum = () => {
    return args.reduce((total, prev) => total + prev);
  }
  return _add;
}

function fn(a, b, c) {
  return a + b + c;
}


console.log(add(1, 2)(3)(4)._sum())
console.log(curry2(fn)(2, 5)(3))
```

### 十一、手写ajax

```js
const url = 'http://localhost:3000/life-notes-sharing/note/list';

function fetch (url) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;
      if (this.status === 200) {
        resolve(this.responseText);
      } else {
        reject(new Error(this.responseText))
      }
    }
    xhr.responseType = 'json';
    xhr.sendRequestHeader('Accept', 'application/json');
    xhr.send(null);
  })
}
```

### 十二、



