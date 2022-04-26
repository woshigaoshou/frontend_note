### 一、Proxy和Reflect

- Proxy

  ```js
  /** 创建代理对象，支持13种捕获器 */
  /** 
  * Reflect：Object作为构造函数，不适合存放方法，所以使用Reflect进行规范集成
  * 另外Reflect的方法与Proxy是一一对应的
  */
  const obj = {
    name: 'nil'
  };
  const objProxy = new Proxy(obj, {
    // receiver的作用是改变对象的this，此时使用this.xxx，this会改成proxy对象
    get(target, key, receiver) {
      return Reflect.get(target, key);
    },
    set(target, key, newValue, receiver) {
      // 会返回布尔值，表示是否设置成功(freeze时会不成功)
      return Reflect.set(target, key, newValue);
    },
    has(target, key) {
      return Reflect.has(target, key);
    },
    deleteProperty(target, key) {
      delete target[key];
    },
    getPrototypeOf() {},				// 获取原型
    setPrototypeOf() {},				// 设置原型
    isExtensible() {},				// 判断是否可扩展
    preventExtensitions(),			// 阻止扩展
    getOwnPropertyDescriptor(),		// 获取描述符
    defineProperty(),					// 定义描述符
    ownKeys() {},						// Object.getOwnPropertyNames和Object.getOwnPropertySymbols
    apply(target, thisArg, argArray) {
    	return target.apply(thisArg, argArray);		// 捕获apply调用
    },
    construct(target, argArray, newTarget) {
      // return new target(...argArray);				// 捕获new操作符
      return Reflect.construct(target, argArray, newTarget); // 调用target的方法，生成的实例是newTarget的实例
    }
  });
  ```

- 响应式原理：

  ![响应式原理](E:\前端学习\frontend_note\图\响应式原理.jpg)

  ```js
  let activeEffect = null;
  const targetDep = new WeakMap();

  class Depend {
    constructor() {
      this.subscribe = new Set();
    }
    depend() {
      if (!activeEffect) return;
      this.subscribe.add(activeEffect);
    }
    notify() {
      this.subscribe.forEach(effect => effect());
    }
  }

  function getDepend(target, key) {
    let depsMap = targetDep.get(target);
    if (!depsMap) {
      depsMap = new Map();
      targetDep.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if (!dep) {
      dep = new Depend();
      depsMap.set(key, dep);
    }
    return dep;
  }

  function watchEffect(fn) {
    activeEffect = fn;
    fn();
    activeEffect = null;
  }

  function reactive(obj) {
    /** vue2实现 */
    Object.keys(obj).forEach(key => {
      let value = obj[key];
      const depend = getDepend(obj, key);
      Object.defineProperty(obj, key, {
        get() {
          depend.depend();
          return value;
        },
        set(newValue) {
          value = newValue;
          depend.notify();
        }
      })
    })
    return obj;
    /** vue3实现 */
    // return new Proxy(obj, {
    //   get(target, key, receiver) {
    //     const depend = getDepend(target, key);
    //     depend.depend();
    //     return Reflect.get(target, key, receiver)
    //   },
    //   set(target, key, newValue, receiver) {
    //     Reflect.set(target, key, newValue, receiver);
    //     const depend = getDepend(target, key);
    //     depend.notify();
    //   }
    // });
  }

  const objProxy = reactive({
    name: 'john'
  });

  watchEffect(function () {
    console.log('执行函数');
    const newName = objProxy.name;
    console.log(newName);
  })

  objProxy.name = 'nil';

  ```

### 二、Promise

- `Promise` 的三种状态：`pending` 、 `fulfilled` 和 `rejected`

- `new Promise` 的回调函数：

  + `resolve`方法接受不同参数会有不同的行为：
    * 普通参数或对象：`pending` -> `fulfilled`
    * `Promise`： 将状态的变化决定权移交给回调的`Promise`
    * 实现了`then`方法的对象（thenable）： 会去执行对象的`then`方法，由`then`方法决定后续的状态
  + `reject`方法以及抛出错误都会触发错误回调，并且无论传入什么参数，状态都会转变为`rejected`

- `Promise.then` ：`then`方法`return`时，若返回的是`Promise`则不进行包装，若为其他值则会使用一个新的`Promise`去包装该返回值，同时在新的`Promise`里面`resolve`该返回值

- `Promise.catch`：`catch`方法捕获异常，针对的是原先的`Promise`，但若在返回的新`Promise`内抛出异常(或`reject`)，则由于影响到了原先的`Promise`状态，导致也能捕获到新的`Promise`。该方法适用于多个`then`回调时，做一个统一的错误处理(相对于写在`then`里面的回调只需写一次)，同时`catch`方法也会返回一个新的`Promise`

- `Promise.finally`：`finally` 方法不接收参数，无论状态是`fulfilled`还是`rejected`都会被执行

- `Promise.resolve`：直接生成一个`fulfilled `状态的 `promise`实例，接受的参数会作为下一个`then/resolve回调`的实参

- `Promise.reject`： 生成一个`rejected` 状态的 `promise`实例，接受的参数作为下一个`catch/reject回调`的实参

- `Promise.all`： 所有`Promise`返回`fulfilled`才会变为`fulfilled`，若有一个为`rejected`，则状态转变为`rejected`

- `Promise.allSettled`： 等待所有`Promise`有结果再返回，每个结果都会有对应的`status`和`value(reason)`

- `Promise.race`： 只要有一个`Promise`有返回结果，就会转变状态

- `Promise.any`： 至少要有一个`Promise`为`fulfilled`或所有`Promise`都为`rejected`才会转变状态

- `Promise`原理：

  ![Promise](E:\前端学习\frontend_note\图\Promise.jpg)

  ```js
  /** 手写Promise A+规范 */
  // 26分开始
  class nilPromise {
    // Promise有三种状态
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
      // 定义数组，因为可能出现同一个Promise多次调用then方法(非链式)，需要一个一个进行调用
      this.onFulfilledCallbacks = [];
      this.onRejectedCallbacks = [];
      try {
        // 外界执行使用resolve和reject函数时，需要绑定this
        executor(this.resolve.bind(this), this.reject.bind(this));
      } catch (err) {
        this.reject(err);
      }
    }
    resolve (value) {
      if (this.status === nilPromise.PENDING) {
        // 当模拟异步使用setTimeout时，只能在resolve和reject包裹
        // 此时在cb内部使用setTimeout而不在resolve和reject包裹会导致一些测试用例无法通过(推测与eventLoop有关)
        // 但是当模拟异步使用queueMicrotask模拟时，可在resolve和reject包裹，也可在cb内部包裹模拟，因为执行的顺序变准确了
        queueMicrotask(() => {
          this.value = value;
          this.status = nilPromise.FULFILLED;
          this.onFulfilledCallbacks.forEach(cb => cb());
        })
      }
    }
    reject (reason) {
      if (this.status === nilPromise.PENDING) {
        queueMicrotask(() => {
          this.reason = reason;
          this.status = nilPromise.REJECTED;
          this.onRejectedCallbacks.forEach(cb => cb());
        })
      }
    }
    static resolvePromise (promise2, x, resolve, reject) {
      // resolve 自身
      if (promise2 === x) return reject(new TypeError('chaining cycle deteced for promise'));
      // 如果是Promise实例，则自身会进行捕获错误，不需要try...catch...
      // 实际上该层判断可以去除，因为本身Promise实例也属于一个thenable，因此下一层的判断对Promise自身也是适用的
      if (x instanceof nilPromise) {
        if (x.status === nilPromise.PENDING) {
          x.then(y => {
            nilPromise.resolvePromise(promise2, y, resolve, reject);
          }, reject)
        } else if (x.status === nilPromise.FULFILLED) {
          resolve(x.value);
        } else {
          reject(x.reason);
        }
        // 非null且具有then的对象或函数
      } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 避免多次调用
        let called = false;
        try {
          const then = x.then;
          if (typeof then === 'function') {
            // 将then的resolve返回值继续进行resolvePromise操作
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
            // 若then不为函数，直接resolve x
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
    then (onFulfilled, onRejected) {
      // 若传入不是函数，则进行初始化
      onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
      onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
      // 返回新的Promise，该Promise resolve上一次return的值
      const promise2 = new nilPromise((resolve, reject) => {
        if (this.status === nilPromise.PENDING) {
          this.onFulfilledCallbacks.push(() => {
            // 使用setTimeout模拟异步，可选择这里模拟，也可以在resolve/reject统一包裹
            // 但在这里包裹时，最好用queueMicrotask进行模拟，才能完全通过测试用例
            // setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              nilPromise.resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
            // });
          })
          this.onRejectedCallbacks.push(() => {
            // setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              nilPromise.resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
            // });
          });
        } else if (this.status === nilPromise.FULFILLED) {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              nilPromise.resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        } else if (this.status === nilPromise.REJECTED) {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              nilPromise.resolvePromise(promise2, x, resolve, reject);
            } catch (err) {
              reject(err);
            }
          });
        }
      });
      return promise2;
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


  ### 三、迭代器



