### 一、面试题

##### 1. 请说一下vue2的响应式原理

响应式的核心思路是数据劫持 + 观察者模式

vue内部在defineReactive方法中通过Object.defineProperty对对象的属性进行重写，在get方法中收集依赖，set方法中使用notify通知视图更新。数组中则是通过数组的变异方法对数组进行拦截，调用notify更新视图。当页面使用响应式属性时，该响应式属性会存放该渲染watcher到自己的dep属性中，当属性发生变化时，会调用update方法将当前的watcher放入queueWatcher队列里，队列主要是做一个去重，调用run方法去更新视图。(nextTick)

##### 2. vue是如何检测数组变化的 

vue会先对数组进行原型链修改，进行函数劫持，每次调用这些重写的方法时会调用notify通知视图更新。但在数组中存放对象是能够被监听到的。vue2对数组的索引并不会使用 `Object.defineProperty` 进行拦截，因为这样太耗费性能了，针对直接修改索引的情况，vue提供了 `$set` 方法。

##### 3. vue中是如何进行依赖收集的 

所谓依赖收集就是观察者模式，这里的被观察者是数据，观察者有三种，渲染watcher、计算属性watcher和用户watcher。在数据中是通过dep进行依赖收集的，在收集的过程中，wathcer也会收集dep，他们之间是多对多的关系。

watcher在调用自己的get方法时，会将自身挂到全局上，此时对数据进行取值时，数据会收集该watcher，同时watcher也会收集到该依赖。这是为了以下的功能而做铺垫：

- 使用v-if时，每次渲染完会进行一个clearDep，之后重新渲染再进行依赖收集，否则不渲染的变量发生改变时，视图也会进行更新
- `computedWatcher` 调用完之后，会将当前的watcher从栈中弹出来，此时若还存在渲染watcher等，会对该watcher收集到的dep进行一个遍历，让这些dep收集当前的渲染watcher等。所以实际上计算属性watcher并不收集依赖，而是一个中间层，让自身的依赖属性收集其渲染watcher。

##### 4. 如何理解Vue中的模板编译原理

在 `Vue` 中模板编译主要是利用`complieToFunctions`将传入的template（或是绑定的el里取outerHTML）生成render函数，在内部先经历以下几个阶段:

1. 通过正则不断匹配截取template，生成ast语法树
2. 通过`generate` 函数，解析ast语法树，得到render code，里面的`_c`、`_v`和`_s`是vue原型上定义好的方法，用于生成指定节点的VNode
3. 利用`new Function`，将生成的`code`字符串进行包裹，同时利用with将this指向当前的实例，最终生成render函数
4. 当执行render函数时，会调用内部的`_c`、`_v`和`_s`方法，获取到VNode Tree，再通过_update -> patch方法挂载到DOM上

##### 5. Vue的生命周期是如何实现的

`Vue`内部是通过发布订阅模式实现的，它会将用户写的生命周期钩子包装成一个钩子，在合适的时机调用`callHook` 。主要靠的是MergeOptions进行策略合并。

一般请求可在created或mounted发送，若需要拿到dom元素则只能放到mounted。

##### 6. nextTick使用事项

通常不涉及dom的获取，放在任意位置即可。但若涉及dom，如以下：

```js
//  此时获取到的aa是最新值3，但dom的内容仍然是未更新前的内容
vm.$nextTick(() => {
  console.log('未改变', vm.aa, document.querySelector('#a').outerHTML);
})
vm.aa = 3;
```

##### 7. v-if 和 v-for 哪个优先级更高？

v-for的优先级更高，生成render函数时，会将v-for渲染成_l函数， v-if会作为return的结果（三元表达式），若遇到需要根据循环变量如`i%2 === 0` 这种表达式，需要先通过计算属性进行处理，若不需要根据循环变量判断，则外面包裹一层template即可。

```js
// vue2版本 v-for优先级高，vue3版本则是v-if优先级更高
function render() {
  with(this) {
    return _c('div', _l((3), function (i) {
      return (flag) ? _c('span') : _e()
    }), 0)
  }
}
```

##### 8. v-model 实现原理

v-model本质上是一个内置的自定义指令，vue内部会判断使用v-model的元素类型，从而使用不同的策略。如input元素，会绑定value，同时监听input事件。组件元素则根据用户定义的model选项进行prop与event的双向绑定（默认是value和Input）。

##### 9. Vue.use 原理以及作用

`use` 方法主要是将vue的构造函数传入插件中，让所有插件依赖的是同一个vue的版本，如果是函数则直接调用，若是对象则调用内部的install方法。

##### 10. name属性的作用 

1. 定义了name属性之后，组件可以递归调用自身
2. 声明组件时能被注册：Sub.options.components[name] = Sub;
3. 通过标识进行组件的跨级通信
4. 作为devtool调试工具的标识

##### 11. Keep-alive原理

通过缓存key和cache映射，缓存当前的vnode，若不是includes范围或在excludes范围内，则直接返回新的vnode。针对max属性，会通过`LRU(Least Recently Used)`算法，保存最近使用的key和map，实际上是为了复用`componentInstance.$el`（缓存过的vnode会有keepAlive和componentInstance属性，此时不会再走$mount的挂载逻辑）。

