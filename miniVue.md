### Vue的三大核心系统
- Compiler模块：编译模板系统，负责将模板编译成render函数，包括`compiler-core`、`compiler-dom`、`compiler-sfc`、`compiler-ssr`
- Runtime(Renderer)模块：真正的渲染模块，包括`runtime-core`、`runtime-ddom`、`runtime-test
- Reactive模块：响应式系统，包括`reactivity`，修改对应value后通过diff算法进行比较，最后通过渲染系统进行渲染

### 源码

#### 虚拟DOM
- 优势
  + 进行diff比较和clone等操作更加方便。
  + 方便实现跨平台，Vue允许开发自己的渲染器(renderer)，在其他平台进行渲染

#### 模板渲染
- `app.createApp`：  
  1. `ensureRenderer().createApp(...args)`(调用渲染器)
  2. `baseCreateRenderer`(返回一个对象，包含createApp函数)
  3. `createAppAPI(实际调用的api，包含多个方法)`
- `app.mount`：  
  1. `createVNode`
  2. `render`
  3. `patch(判断渲染的是组件)`
  4. `mountComponent(挂载组件)`
  5. `createComponentInstance(创建组件实例，用来保存组件状态)`
  6. `setupComponents(初始化实例的数据)`
  7. `setupRenderEffect(设置渲染副作用，实现响应式)`
  8. `patch(多个根节点为fragment，单个为element类型)`


#### diff算法
- diff算法：比较只会在同层级进行, 不会跨层级比较。虚拟dom算法去操作真实dom性能不一定比直接操作dom高，但它能”不管你的数据变化多少，每次重绘的性能都可以接受。
- vue2 diff
  + Vue2的diff算法执行updatevnode比较新旧节点时会优先处理特殊场景，即头头比对，头尾比对，尾头比对等，并借助key值找到可复用的节点进行相关操作，有效减少移动节点的次数。
  + 在 Vue2 里 updateChildren 会进行
    * 头和头比
    * 尾和尾比
    * 头和尾比
    * 尾和头比
    * 都没有命中的对比：生成旧节点map，对比不能复用则创建，可复用则移动，删除旧节点
- vue3 diff
  + vue3中的diff算法中有两个理念，第一个是相同的前置和后置元素的预处理；第二个则是最长递增子序列，此思想又于react的diff类似又不尽相同。
  + 在 Vue3 里 patchKeyedChildren 为
    * 头和头比
    * 尾和尾比
    * 基于最长递增子序列进行移动/添加/删除：生成`keyToNewIndexMap`，生成`newIndexToOldIndexMap`，计算最长递增子序列，移除所有不可复用旧节点，挂载/移动可复用节点

- 比较后会出现四种情况：
  + 此节点是否被移除 -> 添加新的节点
  + 属性是否被改变 -> 旧属性改为新属性
  + 文本内容被改变-> 旧内容改为新内容
  + 节点要被整个替换 -> 结构完全不相同 移除整个替换
- patchChildren:
  + 存在key时，调用patchKeyedChildren方法
  + 不存在key时，调用patchUnKeyedChildren方法
- diff算法只会比较同层级，使用的是深度优先算法，时间复杂度为O(n)
- 判断是否相同节点：`return n1.type === n2.type && n1.key === n2.key`

#### computed实现
- 遍历key，通过isFunction判断，若为函数或对象内部get为函数，则使用bind方法绑定this，若不存在get，则赋值为空函数

#### transition动画组件
当插入或删除被`transition`组件包裹的元素时，vue会做出以下的处理：
1. 自动嗅探目标元素是否应用了CSS过渡或动画，如果有则在恰当的时机添加/删除类名
2. 如果transition组件提供了JS钩子函数，这些函数会在恰当的时机被调用
3. 如果上述两种情况都未发生，则DOM的插入和删除操作会立即执行

#### Vue3选择使用Proxy
- `Proxy`劫持的是整个对象，而`defineProperty`劫持的是key，需要特殊处理，比如新添加了属性，需要使用`Vue.$set`
- 修改对象不同：`Proxy`需要修改实例对象才能触发拦截，而vue2修改原对象即可
- Proxy具有has选项，可以拦截更多的类型，如`delete`方法
- 不兼容IE

#### template使用数据的取值顺序
具体需要看render函数注入的ctx，初次渲染注入的是instance的proxy，proxy中的get函数使用了多个if判断，决定了取值的顺序。
`setup` -> `data` -> `props` -> `ctx(computed/methods等)`

### 具体实现
- 渲染系统模块：
  + h函数：返回一个vNode对象
  + mount函数：将vNode挂载到DOM上
  + patch函数：对两个vNode进行对比
- 可响应式系统模块
- 应用程序入口模块