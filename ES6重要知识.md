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
    static resolve (value) {
      if (value instanceof nilPromise) {
        return value;
      } else if (typeof value === 'object' && 'then' in value) {
        return new nilPromise((resolve, reject) => {
          value.then(resolve, reject);
        });
      }
      return new nilPromise((resolve, reject) => resolve(value));
      // 下面的写法会将promise.resolve变成微任务
      // return new nilPromise(resolve => resolve()).then(() => value);
    }
    static reject(reason) {
      return new nilPromise((resolve, reject) => {
        reject(reason);
      });
    }
    catch (onRejected) {
      return this.then(undefined, onRejected);
    }
    finally (callback) {
      return this.then(callback, callback); // 不传参数则外层嵌套一层function
    }
    static all (promises) {
      if (promises.length === 0) return nilPromise.resolve([]);
      return new nilPromise((resolve, reject) => {
        let count = 0;
        const result = [];
        for (const index in promises) {
          nilPromise.resolve(promises[index])
            .then(res => {
              result[index] = res;
              if (++count === promises.length) resolve(result);
            })
            .catch(reason => {
              reject(reason);
            });
        }
      });
    }
    static allSettled (promises) {
      if (promises.length === 0) return nilPromise.resolve([]);
      return new nilPromise((resolve, reject) => {
        let count = 0;
        const result = [];
        for (const index in promises) {
          nilPromise.resolve(promises[index])
            .then(res => {
              result[index] = {
                status: 'fulfilled',
                value: res
              };
              if (++count === promises.length) resolve(result);
            })
            .catch(reason => {
              result[index] = {
                status: 'rejected',
                reason
              };
              if (++count === promises.length) resolve(result);
            });
        }
      });
    }
    static race (promises) {
      if (promises.length === 0) return nilPromise.resolve([]);
      return new nilPromise((resolve, reject) => {
        for (const promise of promises) {
          nilPromise.resolve(promise)
            .then(resolve, reject);
        }
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


  ### 三、迭代器和生成器（Iterator Generator）

![iterator and  generator](E:\前端学习\frontend_note\图\iterator and  generator.jpg)

- 定义：迭代器(iterator)是一个具体的对象，需要符合迭代器协议，在JS中的体现是`next`方法

- `next` 方法的要求：

  + 一个无参或者	一个参数的函数：需要返回一个具有以下参数的对象：
    * `done`：`boolean`类型
    * `value` ：迭代器返回的值，`done` 为true时可忽略

- 可迭代对象(iterable Object)： 是指一个内部包含`Symbol.iterator` 方法的对象，该方法返回一个迭代器

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

- 生成器：

  ```js
  /** 生成器是一个特殊的迭代器 */
  // 打印顺序 1 2 2 3 3 4
  function* generatorFn (value1) {
    console.log(value1);
    const value2 = yield value1 + 1;	// 返回值给外部value2，内部的value2接受到外部的value2
    console.log(value2);
    const value3 = yield value2 + 1;	// 返回值给外部value3，内部的value3接受到外部的value3
    console.log(value3);
    return value3 + 1;				// return相当于最后一次yield，返回值为{ done: true, value: 4 }
  }
  const generator = generatorFn(1);	// 拿到一个迭代器对象
  console.log(generator);
  const { value: value2 } = generator.next();	// 第一个next由于前面没有yield，因此第一个参数需要通过genaratorFn传递，value2 -> 2
  console.log(value2);
  const { value: value3 } = generator.next(value2);	// value3 -> 3
  console.log(value3);
  const { value: value4 } = generator.next(value3);	// value4 -> 4
  console.log(value4);

  /** 其他方法 */
  generator.return();		// 直接终止，此时done为true
  generator.throw();		// 抛出异常，若异常被捕获，则可以继续.next

  /** 生成器函数替代迭代器 */
  function* generator (arr) {
    yield* arr;			// yield* 相当于下面的for...of 写法
    
    // for (const item of arr) {
    //   yield item;
    // }
  }

  ```

- `async`、`await` 原理：

  ```js
  /** 原理实际是使用一个自动执行生成器的函数 */
  function req (value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(value + 1);
      }, 500)
    });
  }

  function* getData (value) {
    const res1 = yield req(value);
    const res2 = yield req(res1);
    const res3 = yield req(res2);
    const res4 = yield req(res3);
    return res4;
  }

  function execGenerator (generatorFn, ...args) {
    return function () {
      const generator = generatorFn(...args);
      return new Promise((resolve, reject) => {
    	  const _exector = (type, arg) => {
          let result;
          try {
            result = generator[type](arg);
          } catch (err) {
            return reject(err);
          }
    	  const { done, value } = result;
    	  if (done) resolve(value);
    	  return Promise.resolve(value).then(val => _exector('next', val), err => _exector('throw', err));
    	}
        _exector('next');
      });
    }
  }

  /** 下面的写法相当于上述代码的语法糖
   *	async 内部没有异步代码时，执行顺序与普通函数一样
   *	async函数返回一个promise
   *	当内部代码报错时，会终止代码的执行
   *	await 等待执行的代码会用一个promise进行包裹，同时等待resolve之后，在then里面执行next()
   */
  async function getData (value) {
    const res1 = await req(value);
    const res2 = await req(res1);
    const res3 = await req(res2);
    const res4 = await req(res3);
    return res4;
  }

  ```

### 四、EventLoop

- 进程与线程的区别：
  + 进程是cpu资源分配的最小单位（能拥有资源和独立运行的最小单位）
  + 线程是cpu运算调度的最小单位（一个进程里面可以包含多个线程）

- `JS`是单线程的，它的容器是浏览器或者`Node`

- 事件循环规则：每次执行宏任务前，需要先清空微任务队列

  ![EventLoop规则](E:\前端学习\frontend_note\图\EventLoop规则.jpg)

- 事件循环任务类型：

  + 浏览器：

    ![EventLoop](E:\前端学习\frontend_note\图\EventLoop.jpg)

    * 事件队列类型：
      - `microtask queue`：Promise.then、queueMicrotask、Mutation Observer  
      - `macrotask queue`：ajax、setTimeout、setInterval、DOM监听和UI Rendering

  + Node：

    * 事件队列类型：每个队列的执行顺序如下
      * `microtask queue`：
        * `next Tick queue`：process.nextTick
        * `other queue`：Promise.then、queueMicrotask
      * `macrotask queue`：
        * `timer queue`：setTimeout、setInterval
        * `poll queue`：IO事件（Input/Output）
        * `check queue`：setImmediate
        * `close queue`：close事件


### 五、错误处理

- Error类：`TypeError`、`Error`、`RangeError`、`SyntaxError`等

- 异常处理：

  + 抛出异常后，后续的代码不会继续执行
  + 处理方式：
    * 不处理：会将异常继续往外抛，直到最顶层调用，此时会报错并终止程序执行
    * 使用`try...catch`进行捕获

  ```js
  try {
    ...handle
  } catch (err) {
    
  } finally () {
    
  }
  ```

### 六、模块化开发

- 模块化开发：将程序划分为多个小结构

- `CommonJS`：适用于服务器，但由于引入加载都是同步的，因此在浏览器

  + 语法规则：

    ```js
    /** 导出， 第一种 */
    module.exports = {};
    // 或单独变量导出，本质上exports是一个对象
    const name = 'nil';
    module.exports.name = name;

    /** 导入 */
    const obj = require(./xxx);

    obj.name = 'John';	// 由于共享的是同一个对象，因此原文件的变量值也会被更改


    /** 导出， 第二种，最终能导出的对象一定是module.exports指向的对象
     *	源码内部实现逻辑为：
     *	module.exports = {};
     *	exports = module.exports;
     */
    exports.name = name;	// 导出的对象module.exports与exports是同一个

    // 错误写法
    module.exports = {name: 'nil'};
    exports.age = 18;		// 该变量不会被导出


    /** require规则 */
    require(X);
    // 1. X是Node的一个核心模块，如path、http，此时会返回核心模块，停止查找
    // 2. X是以./或../或/(根目录)开头的，此时会按如下顺序查找：
    //   1) 若有后缀名则直接查找后缀名
    //   2) 若无后缀名则按照以下顺序进行查找：
    //      - 直接查找文件X
    //      - 查找X.js
    //      - 查找X.json
    //      - 查找X.node
    //   3) 没有找到文件，则将X作为一个目录
    //      - 查找X/index.js
    //      - 查找X/index.json
    //      - 查找X/index.node
    //   4) 若查找不到，则报not found
    // 3. x既不是核心模块，也没有路径，此时会从当前目录开始逐级往上查找每个路径上的node_modules里是否有匹配的包

    ```

  + require查找规则：

    1. X是Node的一个核心模块，如path、http，此时会返回核心模块，停止查找

    2. X是以./或../或/(根目录)开头的，此时会按如下顺序查找：

       1) 若有后缀名则直接查找后缀名

       2) 若无后缀名则按照以下顺序进行查找：

       - 直接查找文件X
       - 查找X.js
       - 查找X.json
       - 查找X.node

       3)  没有找到文件，则将X作为一个目录

       + 查找X/index.js
       + X/index.json
       + 查找X/index.node

       4)  若查找不到，则报not found

    3. x既不是核心模块，也没有路径，此时会从当前目录开始逐级往上查找每个路径上的node_modules里是否有匹配的包

  + 模块加载过程：

    + 模块在第一次被引入时，模块中的js代码会被执行一次(遇到时才进行加载)
    + 模块在多次被引入时，会缓存，最终只被加载一次(`loaded`为true)
    + 如果有循环引入，则按照 **深度优先搜索** 进行加载

  + 模块加载案例：若存在相互引用变量，则取值会为`undefined`

    ```js
    // 打印结果为 我是b文件 -> 我是a文件 -> node 入口文件
    /** 分析加载顺序，深度优先搜索
     *	1. 首先进入main.js，遇到require，开始加载a.js
     *	2. a.js第一行代码require b.js，开始加载b.js（判断无缓存）
     *	3. b.js 引入 a.js，发现a.js已经被引入过，继续执行，打印'我是b文件'（实际上若b使用a文件的变量，此时是获取不到的）
     *	4. b.js执行完，返回执行a.js，打印'我是a文件'
     *	5. 最终回到main.js，打印'我是main文件'
     */


    // a.js
    const getMes = require('./b')
    console.log('我是 a 文件')
    exports.say = function(){
        const message = getMes()
        console.log(message)
    }

    // b.js
    const say = require('./a')
    const  object = {
       name:'《React进阶实践指南》',
       author:'我不是外星人'
    }
    console.log('我是 b 文件')
    module.exports = function(){
        return object
    }

    // main.js
    const a = require('./a')
    const b = require('./b')

    console.log('node 入口文件')
    ```

    ​

- `ES Module`：

  + 语法规则

    ```js
    /** 1. 通过export导出 */
    // 1) 声明时导出
    export const name = 'nil';
    // 2) 统一导出
    const name = 'nil';
    const age = 18;
    export {
      name,
      age as myAge
    };

    /** 2. import 导出 */
    // 1) 导出成员
    import { name } from './xxx.js';
    // 2) 起别名
    import { name as myName } from 'xxx.js';
    // 3) 将所有内容放到一个标识符内
    import * as foo from './xxx.js';

    /** 3. import和export结合使用 */
    export { name } from './xxx.js';
    export * from './xxx.js';

    /** 4. 默认导出 */
    // 默认导出只能由一个，且导出不需要名字，导入可自定义名字
    export default xxx;
    import xxx from './xxx.js';

    /** 5. 异步导入，用于实现懒加载 */
    import('./xxx.js').then(res => {
      console.log(res);	// 这种方式返回的是一个Promise
    });
    console.log('1');	// 不会阻塞下面代码的执行
    ```

  + `ESModule` 解析规则：

    * 构建阶段：对代码进行静态分析，编译时确定导入导出关系，`import`语句会被提升到最上层。 生成一个`Module Record`的数据结构（记录该文件需要引入哪些模块以及导出哪些变量），同时会生成一个`Module Map`，记录每个模块对应的`Module Record`或者是否处于`fetching`状态，避免资源重复下载
    * 实例化阶段：每个`Module Record`生成一个`Module Environment`实例，内部包含一个`Binding`属性，记录导出/导入的变量，此时变量值为`undefined`
    * 求值阶段：对每个`Module Record`实例的`Binding`属性进行赋值

  + `ESModule`在预处理阶段分析模块依赖和执行阶段执行模块都是采用深度优先搜索，若存在相互引用变量，则会报错，案例如下：

    ```js
    // 打印结果为 b模块加载 -> a模块加载 -> main.js开始执行 -> main.js执行完毕
    /** 分析加载顺序，深度优先搜索
     *	1. 首先进行预处理阶段分析依赖，将所有import语句提升至代码的顶层
     *	2. 执行第一行，开始引入a.js文件
     *	3. 执行a.js第一行，开始引入b.js文件
     *	4. 分析结束，开始执行b.js文件
     *	5. 执行a.js文件
     *	6. 执行main.js文件
     */


    // main.js
    console.log('main.js开始执行')
    import say from './a'
    import say1 from './b'
    console.log('main.js执行完毕')

    // a.js
    import b from './b'
    console.log('a模块加载')
    export default  function say (){
        console.log('hello , world')
    }

    // b.js
    console.log('b模块加载')
    export default function sayhello(){
        console.log('hello,world')
    }
    ```

  + `ESModule`一些细节：

    * `import`导入的变量是只读的，无法被修改

- `CommonJS` 和 `ESModule`相互引用：

  + 浏览器环境：不支持CommonJS
  + Node环境：需要看版本
  + Webpack环境：可相互引用