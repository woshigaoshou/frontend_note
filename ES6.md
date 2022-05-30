### 一、ES6

- 字面量增强：

  ```js
  let name = 'nil';
  const obj = {
    name,			// 属性简写
    fn() {},		// 方法简写
    [name + 1]: 1	// 计算属性名
  }
  ```

- 解构：

  ```js
  // 解构数组
  let names = [1, 2, 3];
  const [item1, item2, item3, item4 = 4] = names;
  const [item, ...newNames] = names;
  const [, b] = names;

  // 解构对象
  let obj = {
    name: 'nil',
    age: 18
  };
  const { name = 'john', age: oldAge } = obj;
  ```

- let、const：

  + 特性：

    ```js
    // 1. let/const定义的变量名不可被重复定义
    // 报错
    let foo = () => ({});
    const foo = 1;

    // 2. 当使用const定义时，值不可被修改(为引用类型时，内部变量能被修改)
    const name = 1;
    name = 2;			// 报错
    const obj = {
      name: 2
    };
    obj.name = 1;		// 成功修改

    // 3. 无作用域提升，当变量使用let/const进行定义时，会在词法作用域实例被创建时创建，但此时是不可被访问的，直到词法绑定被求值
    console.log(age);	// 报错，此时实际已被创建，但不可被访问，所以不存在作用域提升
    let age = 18;

    // 4. 在全局使用var声明属性时，会被添加到window对象，而let/const不会
    let fn = () => ({});

    // 5. ES6的块级作用域，{}，if (true) {}，switch(){}，fo r循环等都是一个代码块
    {
      class Person {}
      function foo() {}
      let a = 1;
      var b = 2;
    }
    console.log(new Person());	// class存在块级作用域，无法访问
    console.log(foo());			// 为了兼容旧代码，function无块级作用域
    console.log(a);				// let/const存在块级作用域，无法访问
    console.log(b);				// var无块级作用域

    const btns = document.getElementByTagName('button');
    for (var i = 0; i < btns.length; i++) {
      btns[i] = function () {
        console.log(`第${i}个元素被点击`)		// 全部为最后一个，因为上层作用域是全局，而不是for的代码块，而全局中的i已经为最后一个元素的索引
      }
    }
    for (const i = 0; i < 2; i++) {}		// 报错，由于i++

    // 6. 暂时性死区
    var a = 1;
    if (true) {								// 报错，当前作用域被绑定
      console.log(a);
      let a = 2;
    }
    ```

  + V8引擎的一些执行逻辑改变：

    * 在ES6之后，`VO`变更为`VE(variable enviroment)`
    * 通过let/const定义的变量，不再和`window`存放到同一个对象，而是独立出来，通过`HashMap`存放到`variable_`，`window`独立出来由浏览器实现

- 模板字符串：

  ```js
  // 基本使用
  const name = 'nil';
  console.log(`my name is \`${name}\``);	// 使用转义

  // 标签模板字符串（调用函数）
  let a = 5;
  let b = 10;

  tag`Hello ${ a + b } world ${ a * b }`;
  // 等同于
  tag(['Hello ', ' world ', ''], 15, 50);

  // 更复杂的例子
  let total = 30;
  let msg = passthru`The total is ${total} (${total*1.05} with tax)`;

  function passthru(literals) {
    let result = '';
    let i = 0;

    while (i < literals.length) {
      result += literals[i++];
      if (i < arguments.length) {
        result += arguments[i];
      }
    }

    return result;
  }

  msg // "The total is 30 (31.5 with tax)"
  ```

  ```js
  // 标签模板”的一个重要应用，就是过滤 HTML 字符串，防止用户输入恶意内容。

  let message =
    SaferHTML`<p>${sender} has sent you a message.</p>`;

  function SaferHTML(templateData) {
    let s = templateData[0];
    for (let i = 1; i < arguments.length; i++) {
      let arg = String(arguments[i]);

      // Escape special characters in the substitution.
      s += arg.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");

      // Don't escape special characters in the template.
      s += templateData[i];
    }
    return s;
  }
  // 上面代码中，sender变量往往是用户提供的，经过SaferHTML函数处理，里面的特殊字符都会被转义。

  let sender = '<script>alert("abc")</script>'; // 恶意代码
  let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

  message
  // <p>&lt;script&gt;alert("abc")&lt;/script&gt; has sent you a message.</p>

  // 另外，应用场景常见于，书写代码时，为了方便阅读使用了模板字符串，此时输出展示可通过标签模板+正则去除空格的方式进行格式化展示
  ```

- 函数默认值：（默认值以及默认值之后的参数，都不会被计算在`fn.length`内）

  ```js
  // 对象解构与默认值配合使用，两种写法
  function fn({name: 'nil', age: 18} = {}) {
    // ...some handle
  }
  function fn({name, age} = {name: 'nil', age: 18}) {
    // ...some handle
  }
  ```

- 剩余参数：

  ```js
  function fn(a, b, ...args) {
    // ...some handle
  }
  fn(1, 2, 3, 4);
  ```

- 展开运算符：

  ```js
  const nums = [1, 2, 3];
  function fn() {
    console.log(arguments);	// 1,2,3
  };
  fn(...nums);

  const obj = { name: 'nil', age: 18 };
  const newObj = { ...obj, age: 19 };		// 重复的key的value会覆盖展开运算符的value
  ```

- 箭头函数

  + 不会绑定 `this` 和 `arguments` 
  + 没有原型`prototype`
  + 不能与 `new` 一起使用，会抛出错误

- 进制的表示：

  ```js
  const num1 = 100;			// 十进制
  const num2 = 0b100;			// binary,二进制
  const num3 = 0o100;			// octonary,八进制
  const num4 = 0x100;			// hexadecimal,十六进制
  const num5 = 10_000_000;	// 大数据连接符，便于阅读
  ```

- class关键字：

  + 类的本质是利用`prototype`实现语法糖

  ```js
  // class 实现继承
  class Person {
   constructor(name) {
    this.name = name;
   }
  }

  class Student extends Person {
   constructor(name, age) {
    super(name);
    this.age = age;
   }
  }
  // babel转为ES5
  "use strict";

  function _typeof(obj) {
    "@babel/helpers - typeof";
    return (
      (_typeof =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (obj) {
              return typeof obj;
            }
          : function (obj) {
              return obj &&
                "function" == typeof Symbol &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? "symbol"
                : typeof obj;
            }),
      _typeof(obj)
    );
  }

  function _inherits(subClass, superClass) {
    // 类型检测，只能通过new调用
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: { value: subClass, writable: true, configurable: true }
    });
    Object.defineProperty(subClass, "prototype", { writable: false });
    // 增加静态方法的调用，原本subClass.__proto__ 指向 Function(new Function创建)，现在找静态方法找不到时会去父类查找
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf =
      Object.setPrototypeOf ||
      function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };
    return _setPrototypeOf(o, p);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
        result;
      // 学完reflect回来看
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError(
        "Derived constructors may only return object or undefined"
      );
    }
    return _assertThisInitialized(self);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called"
      );
    }
    return self;
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
      Boolean.prototype.valueOf.call(
        Reflect.construct(Boolean, [], function () {})
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function _getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
        };
    return _getPrototypeOf(o);
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", { writable: false });
    return Constructor;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  // 标记pure，说明是纯函数，打包时shaking tree检查如果没有调用的话，会直接删除减少代码体积
  var Person = /*#__PURE__*/ _createClass(function Person(name) {
    _classCallCheck(this, Person);

    this.name = name;
  });

  var Student = /*#__PURE__*/ (function (_Person) {
    // 寄生组合式
    _inherits(Student, _Person);
    // 通过super创建实例来调用父类
    var _super = _createSuper(Student);

    function Student(name, age) {
      var _this;

      _classCallCheck(this, Student);

      _this = _super.call(this, name);
      _this.age = age;
      return _this;
    }

    return _createClass(Student);
  })(Person);
  ```
  + 类的方法：

  ```js
  class Person {
    constructor(name, address) {
      this.name = name;
      this._address = address;
    }
    // 普通方法，通过创建出的实例进行访问
    log() {
      console.log(this.name);
    }
    // 访问器方法，对实例属性进行拦截
    get address() {
      return this._address;
    }
    set address(val) {
      this._address = val;
    }
    // 静态方法，可直接通过类名调用，且该方法不会被实例继承
    static random() {
      return random();
    }
  }
  ```
  + `super`关键字用法：

    * `extends`：使用extends关键字继承时，在构造函数内需要调用一次`super(可传入参数)`
    * 在父类的方法处理逻辑上加上子类的逻辑

    ```js
    class subType extends superType {
      ...
      superMethod() {
        super.superMethod();   // 调用父类
        // 子类逻辑
        ...
      }
      // 重写静态方法
      static staticMethod() {
        super.staticMethod();   // 调用父类
        // 子类逻辑
        ...
      }
    }
    ```

- `symbol`的使用：

  ```js
  js
  // 生成一个独一无二的值，避免键命名重复冲突
  const name = Symbol();
  const obj = {
    [name]: 'nil'
  };

  // 通过传入描述符进行区分
  const name = Symbol('name');
  const obj = {
    [name]: 'nil'
  };
  console.log(name.description)	// name

  // 无法通过遍历/Object.keys()进行获取，只能通过Object.getOwnPropertySymbols获取
  const keys = Object.getOwnPropertySymbols(obj);
  console.log(keys);				// [Symbol(name)]

  // 通过Symbol.for创建的symbol，会被放入全局注册表中，相同key的symbol，返回值一样（即创建时会先去全局注册表查找，若查到则直接返回）
  const s1 = Symbol.for('name');
  const s2 = Symbol.for('name');
  console.log(s1 === s2);			// true
  console.log(Symbol.keyFor(s1))	// name
  ```

- `Set`和`Map`：

  ```js
  //  Set的方法：add、has、delete和clear，对对象的引用是强引用
  const mySet = new Set();
  set.add(1);
  set.add(2);
  set.delete(1);
  set.has(1);		// false
  set.clear();
  //	WeakSet：
  //	1. 只能存放对象类型，不能存放基本类型
  //	2. 对对象是弱引用，若对象没有被其他所引用，则会被gc进行回收
  //  3. 无法进行遍历，由于是弱引用，如果遍历获取其中的元素，可能造成对象不能正常销毁的问题
  const myWeakSet = new WeakSet();
  WeakSet.add(1);		// TypeError: Invalid value used in weak set

  //	WeakSet应用场景
  const personSet = new WeakSet();
  class Person {
    constructor() {
      personSet.push(this);
    }
    running() {
      if (!personSet.has(this)) throw Error('不能通过其他方式调用该方法');
      console.log('running');
    }
  }

  //	map的方法：set、get、has、delete和clear
  //	通过对象存储键值对时，key只能存储为字符串(会自动转换)，而map的key可以是任意类型
  const myMap = new Map([[key1, value1],key2, value2]);
  for (let [key, value] of myMap) {
    console.log(key, value);
  }

  //	WeakMap：
  //	1. key只能是对象
  //	2. 对key的引用是弱引用，对象没有被其他所引用时，会被回收
  //	3. 无法被遍历
  const obj = {name: 'nil'};
  const myWeakMap = new WeakMap();
  myWeakMap.set(obj, 1);

  //	WeakMap应用场景：参考miniVue的响应式拦截(reactive)，收集依赖时使用了WeakMap存储每个对象改变时需要执行的副作用
  ```

  + WeakMap 应用场景


   ![响应式原理使用WeakMap](.\图\响应式原理使用WeakMap.jpg)

- 一些常用API：

  ```js
  /**	ES7 */
  //	indexOf、includes(可判断NaN)和Math.pow

  /**	ES8 */
  //	对象的获取
  1. Object.keys();
  2. Object.values();
  3. Object.entries();

  //	字符串的填充
  4. str.padStart(num, char);		// 在前面填充字符char至num长度
  5. str.padEnd(num, char);		// 在后面填充字符char至num长度

  //	获取描述符
  6. Object.getOwnPropertyDescriptors()

  /**	ES9 */
  1. Async iterators				// 迭代器
  2. Object spread operators		// 展开运算符
  3. Promise.finally				// Promise的finally方法

  /**	ES10 */
  1. Array.flat()					// 数组扁平化
  2. Array.flatMap()				// 先通过映射生成新数组再进行扁平化
  const message = ['hello world'];
  message.flatMap(item => item.split(' '));	// ['hello', 'world']

  3. Object.fromEntries()			// 将entries格式的数组转化为对象
  const queryString = 'name=nil&&age=18';
  const query = new URLSearchParams(queryString);
  const paramsMap = Object.fromEntries(query);

  // 字符串空格去除
  4. str.trimStart()
  5. str.trimEnd()

  6. Symbol description			// symbol类型描述符

  /** ES11 */
  1. BigInt						// const num = BigInt(10);或const num = 10n;
  2. ??							// 空值合并运算符，能准确判断是否为undefined
  3. ?.							// optionalChaining，可选链
  4. globalThis(浏览器和Node都能获取)// 获取全局this，需要看浏览器和node版本是否支持

  /** ESS12 */
  1. FinalizationRegistry			// 监听对象的销毁
  const finalRegistry = new FinalizationRegistry((value) => {
  	console.log(value + '被销毁了');	// obj对象被销毁了
  });
  const obj = {
  	name: 'nil'
  };
  finalRegistry.register(obj, 'obj对象');
  obj.null;

  2. WeakRef						// 通过弱引用，去引用一个对象(不影响垃圾回收机制)
  let obj = { name: 'nil' };
  let info = new WeakRef(obj);
  obj = null;
  console.log(info.deref());		// undefined

  3. 逻辑或/与/空赋值运算
  let msg = undefined;
  msg ||= 'nil';					// nil

  ```

  ​