### 一、浏览器工作原理 

1. 输入域名，渲染过程：

   - 构建请求：

     + 请求行：`GET URI HTTP1.0`
     + 请求头
     + 请求体


   - 查找缓存：DNS缓存和资源缓存

   - 解析IP地址和端口


   - DNS解析：
     * 过程：查找浏览器缓存 -> 查找操作系统缓存 -> 查找hosts文件是否有对应映射 ->  本地域名服务器查找 -> 顶级域名服务器查找 (引导去二级域名服务器查找) -> 二级域名服务器查找(引导去三级域名服务器查找) -> 三级域名服务器查找(引导去下级服务器查找) -> 继续往下级查找直至返回映射关系
     * 递归：前三步查找时，有则直接返回映射关系，否则去其他域名服务器查找
     * 迭代：后续去顶级域名服务器等查找，如果能查找到则直接返回映射关系，否则告诉其去下级域名服务器查找或报错
   - 等待TCP队列
   - 建立连接
   - 发送HTTP请求
   - 服务器处理请求
   - 服务器响应请求：
     + 响应行：`HTTP1.0 200`
     + 响应头：
       * set-cookie
       * keep-alive
       * cache-control
     + 响应体
   - 断开TCP连接
   - 浏览器渲染：
     * 构建DOM Tree
     * 生成CSSOM
     * `DOM Tree` 和 `CSSOM` 并行构建，互不影响，最终结合生成Render Tree(layout tree)
     * 由于 `layout tree` 需要 `DOM Tree` 和 `CSSOM` 结合才能生成，因此 `CSSOM` 会阻塞页面渲染
     * 遇到 `JS` 脚本时，由于`  JS` 可能会对DOM或者样式进行操作，因此`JS` 脚本会被阻塞直到 `CSSOM` 构建完成才能执行，而当执行 `JS` 脚本执行时，会停止 `DOM Tree` 的构建，因此在该种情况下 `CSSOM` 变相阻塞了 `DOM Tree` 的构建
     * `JS` 执行时会阻止 `Render Tree` 的构建，因为JS引擎和GUI引擎是互斥的

2. JavaScript引擎：

   - `BLink` 会将 `JS` 代码转换为 `Stream(流)`


   - 通过词法分析（扫描器 `scanner` ）将 `Stream` 代码转化为 `tokens` 
     - 利用 `parse` 模块将 `tokens` 代码转换为 `AST树 `（进行词法分析和语法分析），未使用的函数进行 `preParse(预解析)` 
   - 利用 `ignition` 模块将 `AST树` 转换为 `字节码`
   - 由于不同环境下CPU的构造不同，对应的机器码也不同，因此不能直接转换为机器码
   - 为了提高效率， 利用 `TurboFan` 模块对字节码进行转换，并标记函数是否为 `hot` (重复使用的函数，便于缓存)，使其更接近与对应环境的字节码
   - 将优化后的字节码转换为机器码并由CPU执行

### 二、执行上下文栈(Execution Context Stack)

1. 在转换为 `AST` 的过程中，V8引擎会创建一个 `Global Object(全局对象，简称GO)`。 

2. `JS` 引擎内部具有一个**执行上下文栈(简称ECS)** ，是用于执行代码的**调用栈**。

3. 为了执行全局的代码块，会创建一个**全局执行上下文** (`Global Execution Context，简称GEC`)，此时 `GEC` 会被放入 `ECS` 中执行

4. `VO` ：在全局执行上下文中，称为`GO` ，在函数上下文中，称为 `AO `，最新的ECMA标准使用`Variable Environment` ，在变量环境里面添加环境记录

5. 声明一个函数并调用时，会做出以下操作：

   + 保存作用域链到内部属性 `[[scope]]` 
   + 执行该函数，将函数执行上下文(`FEC`)压入调用栈(以下操作都在执行上下文进行)
   + 复制函数的`[[scope]]` 属性创建作用域链
   + 初始化 `AO` ：
     * 形参：若传入实参，则value为实参
     * 函数：值为函数对应的地址，若存在变量名称，则直接替换
     * 变量：值为赋予变量的值，若存在相同名称的形参或函数，则不会干扰已存在的属性
   + 将 `AO` 压入作用域链顶端：`[AO, [[scope]]]`
   + 执行函数，修改变量值，最终将 `FEC` 弹出调用栈

6. 作用域补充

   - **对象**不产生作用域，`if`等语句产生作用域


   - 未用关键字声明的变量，直接进行赋值时会提升到全局作用域

     ```js
     function foo() {
       var a = b = 10;
     }
     foo();
     console.log(a); // a is not undefined
     console.log(b); // 10
     ```

### 三、内存管理

1. 内存分配方式：
   - 基本数据类型：栈空间
   - 复杂数据类型：在堆开辟空间，将空间的指针返回值变量进行引用
2. 垃圾回收(Garbage Collection，简称GC)
   - 引用计数：每当有一个引用时，计数加一；引用指向其他值时，计数减一；当计数为0时则会被回收。但存在循环引用的弊端。
   - 标记清除：设置根对象(root object)，垃圾回收器会定期从根开始继续遍历，若对象没有被引用，则在下次回收时会被清除。当变量进入环境时，将变量标记为“进入环境”，当变量离开环境时（如函数执行结束），将变量标记为离开环境。(https://blog.csdn.net/gzzzzzzzz/article/details/106873776?spm=1001.2014.3001.5501)

### 四、闭包(closure)

1. 组成：**函数** 和 **自由变量** (上层作用域的变量)
2. 自由变量没有被销毁的原因：当前函数的`parentScope` 指向父函数的`AO` (垃圾回收机制，GC)
3. 根据ECMA规范，上层作用域的**自由变量** 无论是否被引用都会保留，但具体需要看浏览器的实现，如v8引擎则不会保留(为了优化性能，通过debugger查看闭包)。
4. 内存泄漏：变量保存着函数的引用，导致函数的

### 五、this指向

1. 浏览器下：`this` 指向 `window(GO)` ；`node` 环境下，`this` 指向`{}(空对象)`

2. `this` 是动态绑定的，与调用的方式有关 

3. 绑定规则：
   - 默认绑定：
     + `function` 关键字定义：独立函数调用时，默认指向`Window`
     + `setTimeout` 和 `setInterval` 指向` Window`
   - 隐式绑定：
     + 对象调用方法：`this` 指向调用该方法的对象
     + 事件触发回调，`this` 指向`DOM`
   - 显式绑定：
     + 通过`apply`、`call`、`bind` 改变`this` 指向 (**当传入参数为null/underfind时，会指向window**)
   - new绑定：
     + 使用new关键字时，会创建一个空对象，将`this` 指向该对象。（new创建实例执行过程具体参考xxx）
   - 箭头函数：不适用上述规则

4. 绑定规则优先级：new绑定 > 显示绑定 > 隐式绑定 > 默认绑定

   ```js
   function foo() {
     console.log(this);
   }
   const obj = {
     objFn: function() {
       console.log(this);
     }
   }
   const bindFn = foo.bind('bind-fn');
   const a = new obj.objFn();  // objFn() {}  证明new优先级高于隐式绑定，否则会打印obj对象
   const instance = new bindFn(); // foo() {} 证明new优先级高于显示绑定
   obj.objFn.call('call-this'); // call-this  证明显示高于隐式
   obj.objFn(); // obj  不是window，证明隐式高于默认绑定
   ```

5. 特殊绑定

   ```js
   const obj1 = {
     foo: function() {
       console.log(this);
     }
   }
   const obj2 = {};
   // 间接函数引用
   obj2.foo = obj1.foo;
   obj2.foo(); // obj2
   (obj2.foo2 = obj1.foo)(); // window
   // 忽略显示绑定
   obj2.foo(null); // window
   ```

6. 面试题：https://mp.weixin.qq.com/s/hYm0JgBI25grNG_2sCRlTA

7. 实现 `call` 、`apply `和 `bind` 函数(参照手写文档)


### 六、函数式编程

1. 高阶函数：接收一个或多个函数输入，输出一个函数
2. 纯函数：

- 函数有确定的输入值时，需要产生相同的输出
- 函数执行的过程中，不能产生副作用（除了返回值以外，对函数以外的范围产生了影响，如修改了全局变量）

3. 柯里化：

- 一个函数接收一些参数，返回值是能接收剩余参数的原函数，需要额外注意的是需要给原函数绑定`this`(返回函数的`this`)

- ```js
  // 参数定长的柯里化
  function nilCurry(fn) {
    const argLen = fn.length;
    const presetArgs = [].slice.call(arguments, 1);
    return function(...args) {
      const allArgs = [...presetArgs, ...args];
      if (allArgs.length >= argLen) {
        return fn.apply(this, allArgs);
      }
      return nilCurry.call(null, fn, ...allArgs);
    }
  }
  // 不定长的柯里化
  function add(fn) {
    const args = [].slice.call(arguments, 1);
    const _add = function() {
      args.push(...arguments);
      return _add;
    }
    _add.sumof = function() {
      return args.reduce((prev, cur) => {
        return prev + cur;
      });
    }
    return _add;
  }
  ```

4. 组合函数：同时传入多个函数，每个函数的实参为前一个参数的执行结果(第一个函数的实参由新生成的函数传入)

   ```js
   function nilCompose(...fns) {
     const length = fns.length;
     for (let i = 0; i < length; i++) {
       if (typeof fns[i] !== 'function') {
         throw new TypeError('Expected arguments are function');
       }
     }
     function compose(...args) {
       let index = 0;
       let result = length ? fns[index].call(this, args) : args;
       while(++index < length) {
         result = fns[index].call(this, result);
       }
       return result;
     }
     return compose;
   }
   ```

   ​

### 七、ES6~ES12

1. 箭头函数：
   - 不会绑定 `this` 和 `arguments` 
   - 不能与 `new` 一起使用，会抛出错误