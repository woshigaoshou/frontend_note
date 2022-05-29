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
function nilNew(fn) {
  const obj = Object.create(fn.prototype);
  const result = fn.call(obj, ...arguments);
  return result instanceof Object ? result : obj;
}
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

### 七、



