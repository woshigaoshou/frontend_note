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

