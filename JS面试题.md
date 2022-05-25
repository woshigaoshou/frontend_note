### 一、 数据类型

##### 1. JavaScript有几种数据类型，它们的区别？

JavaScript共有八种数据类型，分别是：

- 原始数据类型：`Number`、`String`、`Boolean`、`undefined`、`null`、`Symbol `和 `BigInt`
- 引用数据类型： `Object`（普通对象Object，数组对象Array，日期对象Date，函数对象Function，数学对象Math，正则对象RegExp）


两种数据类型的区别在于存放位置的不同（创建对象成本比较大，所以引用同一份数据能节省性能）：

- 原始数据类型是直接存储在栈中的简单数据段，占据空间小、大小固定，属于被频繁使用的数据，所以放入栈中存储。
- 引用数据类型是存储在堆中的对象，占据空间大，大小不固定。引用数据类型实际在栈中存放的是指针，指针指向堆中该实体存放的起始地址。当解释器寻找引用值时，会先在栈中寻找指针，再到堆中寻找实体。

##### 2. 数据类型检测的方式有哪些

(1) `typeof`：null，数组和对象都会被判断为`object`

```js
console.log(typeof 2);						// number
console.log(typeof 'str');					// string
console.log(typeof true);					// boolean
console.log(typeof {});						// object
console.log(typeof []);						// object
console.log(typeof null);					// object
console.log(typeof function () {});			// function
console.log(typeof undefined);				// undefined
```

(2) `instanceof`： 只能正确判断引用类型

```js
console.log(2 instanceof Number);				// false
console.log('str' instanceof String);			// false
console.log(true instanceof Boolean);			// false

console.log([] instanceof Array);				// true，function Array() {}
console.log(function(){} instanceof Function);	// true，function Function() {}
console.log({} instanceof Object);				// true，function Object() {}
```

(3) `constructor`： 有两个作用，一是判断数据的类型，二是对象实例通过 `constructor` 对象访问它的构造函数。需要注意，如果创建一个对象来改变它的原型，`constructor`就不能用来判断数据类型了。该方法只能判断引用数据类型。

```js
function Fn(){};
 
Fn.prototype = new Array();	// 改变Fn的prototype指向
 
var f = new Fn();	// 返回的实例__proto__指向上面创建的数组，它的constructor为[]的constructor，即Array.prototype.constructor（Array）
 
console.log(f.constructor === Fn);    // false
console.log(f.constructor === Array); // true
```

(4) `Object.prototype.toString.call()`

```js
var toString = Object.prototype.toString;
 
console.log(toString.call(2));				// [object Number]
console.log(toString.call(true));			// [object Boolean]
console.log(toString.call('str'));			// [object String]
console.log(toString.call([]));				// [object Array]
console.log(toString.call(function(){}));	// [object Function]
console.log(toString.call({}));				// [object Object]
console.log(toString.call(undefined));		// [object Undefined]
console.log(toString.call(null));			// [object Null]
```

##### 3.  判断数组的方式有哪些

- `Object.prototype.toString.call([]) === '[object Array]'`
- `Array.isArray([])`
- `[] instanceof Array`
- `[].constructor === Array`

##### 4. null和undefined区别

null表示空对象，undefined表示未定义，用双等号"=="比较时会返回true

##### 5. typeof null 的结果是什么，为什么？

`typof null` 的结果是 object，但它并不是空对象。之所以这样是因为初始版本的JS，兼容32位操作系统，用3位长度表示类型，其中`000`表示`object`，而null表示为全0，存在误判。

##### 6. intanceof 操作符的实现原理及实现

instanceof 运算符用于判断构造函数的 prototype 属性是否出现在对象的原型链中的任何位置。

```js
function myInstanceof (left, right) {
  if (typeof left !== 'object' || left === null) return false;
  let proto = Object.getPrototypeOf(left);
  const prototype = right.prototype;
  while (true) {
    if (proto === null) return false;
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
}
```

##### 7. 为什么0.1+0.2 ! == 0.3，如何让其相等

由于计算机计算是通过二进制的，JavaScript使用64位来表示数字，其中1位符号位，11位指数位，52位小数位。在转换时会舍0取1，而0.1的二进制是：`0.0001100110011001100...`（1100循环），0.2的二进制是：`0.00110011001100...`（1100循环），两个数相加，保留52位再转换为十进制会存在误差。

解决方法：

- 保留需要的小数位：`(0.1 + 0.2).toFixed(1) == 0.3`
- 判断是否在误差范围内：`(0.1 + 0.2) - 0.3 < Number.EPSILON`

##### 8. typeof NaN 的结果是什么？

NaN 指“不是一个数字”（not a number），NaN 是一个“警戒值”（sentinel value，有特殊用途的常规值），用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。

```
typeof NaN; // "number"
```

NaN 是一个特殊值，它和自身不相等，是唯一一个非自反（自反，reflexive，即 `x === x` 不成立）的值。而 `NaN !== NaN` 为 true。

##### 9. isNaN 和 Number.isNaN 函数的区别？

- isNaN 会先进行类型转换，不能被转为为数值的值会返回true，因此其他类型的值也会返回true，造成误差
- Number.isNaN 会先判断是否是一个数字，再进行判断是否是NaN，只有当参数为NaN时才会返回true

##### 10. == 操作符的强制类型转换规则？

