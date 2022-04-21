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

### 二、执行上下文栈(Execution Context Stack，ES6前)

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


### 七、补充

1. with语句：

   ```js
   with(obj) {
     console.log(name); // 优先寻找obj内的变量，可以形成自己的作用域
   }
   ```

2. eval函数：

   ```js
   const jsString = 'var message = "hello world"; console.log(message);'
   eval(jsString);     // 将字符串转成js代码并执行
   ```

3. 严格模式：严格模式是一种具有限制性的`JavaScript`模式，使代码脱离"懒散(sloppy)"模式。支持严格模式的浏览器在检测到严格模式时，会以更加严格的方式对代码进行检测和执行。

- 严格模式作用：
  + 通过抛出错误来消除一些原有的静默错误(语法错误，但对执行不影响，如`xxx.name = 1`)
  + 严格模式让JS引擎在执行代码时有更多的优化(不需要处理一些特殊的语法)
  + 严格模式禁用了未来ECMAScript版本可能会定义的一些语法

- 开启严格模式：
  + 全局开启：在全局里面使用`use strict`
  + 局部开启：在函数使用`use strict`

- 严格模式常见规则：

  ```js
  // 1. 禁止意外创建全局变量
  use strict;
  function foo() {
    age = 20;
  }
  // 2. 不允许有相同参数名
  function fn(x, y, x) {
    console.log(x, y, x);
  }
  // 3. 静默错误
  const obj = {};
  obj.defineProperty(obj, 'name', {
    writable: false,
    value: 'nil'
  });
  obj.name = 'john';
  // 4. 不允许使用with语句
  with(obj) {
    console.log(name);
  }
  // 5. eval语句不会向上引用变量
  const jsString = 'var message = "hello world"; console.log(message);'
  eval(jsString);
  console.log(message);
  // 6. 自执行函数报undefined
  function add() {
    console.log(this);  // undefined
  }
  // 7. setTimeout内部的回调使用function定义，仍指向window（chromium源码使用了apply）
  setTimeout(function () {
    console.log(this);  // window
  }, 1000);
  ```

### 八、面向对象

1. 对象的操作：

   - `Object.defineProperty` (get和set不能与value和writable混合使用)：

     + 数据属性描述符：

       ```js
       const obj = {
         name: 'nil'            // 直接添加的成员也有属性描述符，value为赋予的值，其他为true
       };
       object.defineProperty(obj, 'address', {
         configurable: false,   // 默认为false，此时不能被删除或者重新使用描述符定义
         value: 'shenzhen'      // 默认为undefined
         enumberable: false,    // 默认为false，能否被枚举
         writable: false        // 默认为false，能否被重新赋值
       });
       ```

     + 访问属性描述符：

       ```js
       // 1. 用于隐藏私有属性
       // 2. 用于截获获取或赋值的过程
       const obj = {
         name: 'nil',           // 直接添加的成员也有属性描述符，value为赋予的值，其他为true
         _address: 'shenzhen'
       };
       object.defineProperty(obj, 'address', {
         configurable: false,   // 默认为false，此时不能被删除或者重新使用描述符定义
         enumberable: false,    // 默认为false，能否被枚举
         get() {                // 默认为undefined
           return this._address;
         },
         set(newVal) {                // 默认为false，能否被重新赋值
           this._address = newVal;
         }
       });
       ```

   - `Object.defineProperties` (一次定义多个属性描述符)：

     ```js
     const obj = {
       _name: 'nil',
       _age: 19,
       // 直接在对象内定义属性描述符，此时configurable和enumberable为默认值
       set age() {
         return this._age;
       },
       get age(value) {
         this._age = value;
       }
     };
     obj.defineProperties(obj, {
       name: {
         get() {
           return this._name;
         },
         set(value){
           this._name = value;
         },
         configurable: false,
         enumberable: true,
       },
       address: {
         value: 'shsenzhen',
         writable: true,
         configurable: false,
         enumberable: false,
       },
     });
     ```

   - `Object.preventExtensions`：禁止向对象里面添加属性

   - `Object.seal` ：禁止对象配置/删除属性

   - `Object.freeze`：禁止对象修改属性(冻结)

2. 对象的特性：

   - 封装
   - 继承
   - 多态：对不同数据类型，执行相同操作，表现出来的行为不同

3. 创建对象的方案：

   - 工厂模式：使用`new`操作符批量创建（创建过程参考手写代码），缺点是重复创建了多个相同的方法，可通过原型来解决该问题
     + 使用`Object.create(fn.prototype)`创建空对象，同时将空对象原型指向构造函数原型
     + 构造函数内部的`this`会指向空对象：`fn.call(obj, ...arguments)`
     + 指向构造函数内部代码
     + 判断是否返回一个非空对象，若是非空对象则返回该对象，否则返回之前创建的对象

4. 对象的原型：

   + 作用：当获取实例的属性找不到时，会去实例的原型去寻找

   - 获取实例的原型：`Object.getPrototypeOf`

   - 每个构造函数都有一个`[[prototype]]`指向原型，同时原型有一个属性`constructor`指向构造函数，`constructor`属性通过属性描述性设置了不可枚举，需要通过`instance.getOwnPropertyDescriptors`获取属性描述器查看

   - 构造函数使用`new`操作符后会创建出实例，该实例存在`__proto__`属性指向原型对象

   - 当使用对象覆盖`[[prototype]]`时，需要将该对象的`constructor`属性指回构造函数，但之前创建的对象`__proto__`仍指向原来的原型

     ```js
     foo.prototype = {
       name: 'nil',
       // ...
     };
     Object.defineProperty(foo.prototype, 'constructor', {
       enumberable: false,
       configurable: true,
       writable: true,
       value: foo
     });
     ```

5. 原型链

   - 顶层原型：`[Object: null prototype] {}`

     + 内部包含多个方法，但都是不可枚举的
     + 顶层原型的`__proto__`指向null
     + 从一个对象里面获取属性，会沿着原型链一直查找

   - 原型链如下图所示：

     * 所有构造函数的`prototype`都是一个对象，由`Function Object`创建，因此这些`prototype`的`__proto__`都指向`Object.prototype`
     * 所有的`function`都由`function Function`创建(包括自身，`Function.__proto__`指向`Function.prototype`)，因此这些`function`的`__proto__`都指向`Function.prototype`
     * 最终`Object.prototype`指向`null`

     ![原型链](E:\前端学习\frontend_note\图\原型链.jpg)

6. 继承的实现：

   - 类的三大特性：封装(将方法和属性封装在类上)、继承(子类继承父类)和多态(不同对象表现不同状态)

   - 继承的方式：

     ```js
     // 直接使用new创建，内存消耗大，相同的方法重复创建，所以使用以下的继承方案
     function Animal() {
       this.name = 'Tom';
     }

     // 1. 原型链继承，父类实例存在引用类型时，多个实例会同时修改一份数据，且父类的数据无法接受参数
     function Person() {
       this.name = 'person';
     }
     Person.prototype.log = function() {
       console.log(this, this.name);
     }
     const person = new Person();
     function Student() {}
     Student.prototype = person;
     const student = new Student();
     student.log();    // 此时在student实例上找不到log方法，沿着原型链向上找，最终找到Person的原型链上的log方法，利用隐式绑定调用，打印this(student实例，this指向Student实例)和this.name(在this(student)上寻找name属性,最终在person的实例上找到)

     // 2. 借用构造函数继承
     // 解决了原型链继承的问题
     // 缺点：
     // 1)只能继承父类实例的属性和方法，不能继承原型上的方法
     // 2)每个子类都有父类的副本，重复创建
     function Person(name) {
       this.name = name;
     }
     function Student(name, age) {
       Person.call(this, name);
       this.age = age;
     }

     // 3. 组合继承
     // 解决了以上两种继承的问题
     // 缺点：
     // 1)但父类至少被调用两次
     // 2)多出一些无用的属性(存在两份相同的属性和方法)
     function Person(name) {
       this.name = name;
     }
     Person.prototype.log = function() {
       console.log(this, this.name);
     }
     const person = new Person();
     function Student(name, age) {
       Person.call(this, name);
       this.age = age;
     }
     Student.prototype = person;
     const student = new Student('Tom', 18);

     // 4.原型式继承
     // 缺点：
     // 1)无法传递参数
     // 2)原型链上存在引用值会篡改同一份
     function createObj(o) {
       function fn(){};
       fn.prototype = o;
       return new fn();
     }
     function Person() {
       frends: []
     }
     const obj1 = createObj(Person);
     obj1.name = 'John';
     obj1.frends.push('John');
     const obj2 = createObj(Person);
     obj1.name = 'Tom';
     obj1.frends.push('Tom');

     // 5.寄生式继承
     // 缺点：同原型式继承，利用了工厂函数进行创建
     function createObj(o) {
       function fn() {}
       fn.prototype = o;
       return new fn();
     }
     function creatAnother(original) {
       const clone = createObj(original);
       clone.log = function() {
         console.log(this);
       }
       return clone;
     }

     // 6.寄生组合式继承
     function createObject(o) {
       function fn() {};
       fn.prototype = o;
       return new fn();
     }
     function inheritPrototype(subType, superType) {
       subType.prototype = createObject(superType);
       Object.defineProperty(subType.prototype, 'constructor', {
         enumberable: false,
         configurable: true,
         writable: true,
         value: subType
       });
     }
     function SuperType(name) {
       this.name = name;
       this.colors = ['blue', 'red'];
     }
     SuperType.prototype.sayName = function() {
       console.log(this.name);
     }
     function SubType(name, age) {
       SuperType.call(this, name);
       this.age = age;
     }
     SubType.prototype.sayAge = function() {
       console.log(this.age);
     }

     // 7.class继承
     class Student extends Person {
       // 添加额外方法等操作...
     }

     // 8.JS是单继承，不能同时继承多个类，需要实现混入继承
     function Person(name) {
       this.name = name;
     }
     function Student(name, age) {
       Person.call(this, name);
       this.age = age;
     }

     function Other () {}
     Other.prototype.otherMethod = function() {
       console.log('other');
     }

     Student.prototype = Object.create(Person.prototype);
     console.log(Student.prototype);
         
     Object.assign(Student.prototype, Other.prototype);

     const stu = new Student(18);
     console.log(stu);
         
     stu.otherMethod();
     ```

7. 原型内容补充：

   - `hasOwnProperty`：是否具有自己的属性，在原型上则返回false
   - `in`：在原型或自身上都返回true
   - `instanceof`：判断构造函数的`prototype`是否在实例的原型链上
