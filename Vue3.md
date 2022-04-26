### 基础
- template标签不为vue特有的标签，放入template标签的内容不会被渲染出来，v-for可以配合template使用，此时不会渲染出多余的标签
- vscode生成代码片段：

### vue3
- methods里面定义的函数不能使用箭头函数，使用普通函数写法时，在vue内部使用了bind方法改变this指向，因此指向vue实例，若使用箭头函数，会造成bind失效的问题，且由于在严格模式下，this变为undefined。
- VNode：`Virtual Node`(虚拟节点)，组件和元素都会被转换为VNode，本质上还是一个JS对象，渲染过程为template=>编译-> VNode->渲染 -> 真实DOM
- treeShaking：兼容vue2的options_api
- 编译过程：`HTML代码(template)`(解析) -> AST树(HTML) -> `AST树(JS)`(generator) -> `JS代码`
- `block Tree`：将动态的节点放入，一些未引用变量的静态节点利用作用域提升保存，减少`createVNode`函数的调用。另外在挂载时若`blockTree`存在，则之间对该数组进行一个diff对比即可。

### Vue的不同版本（compile和runtime）
- vue(.runtime).global(.prod).js：通过CDN和直接下载使用的版本
- vue(.runtime).esm-bundle.js：用于webpack/rollup和parcel等构建工具（默认为vue.runtime.global.js，缺少编译过程）
- vue.cjs：服务端渲染使用

### 使用方式
- template
- render：使用h函数来编写渲染内容
- .vue：通过.vue文件中的template来编写模板

### SFC(single-file components(单文件组件))
- 插件1：Vetur，提示更友好
- 插件2：Volar，对TS和Vue3支持更好(官方推荐)

### 语法
- class(style)语法：
  + 对象: `:class="{ class1: isActive }"`
  + 数组: `:class="['class1', 'class2', { active: isActive }]"`

### 用法
- 非props的Attribute：
  + 组件有单个根节点的时候，传递给某个组件某个属性，但未被组件Props定义，此时会被自动添加到根节点的Attribute里。此时可设置`inherAttrs: false`来阻止继承。
  + 多个根节点的时候，必须指定绑定到哪一个根节点，否则会报警告。

- emits：需要提前注册需要发送的事件，如`emits: ['add', 'sub']`

- 组件通信
  + 父子组件通信：
    * props/emit
    * ​
  + 非父子组件通信：
    * Provide/Inject(long range props)：数据为非响应式，需要通过传递对象，如
    ```
    provide() {
      return {
        length: computed(() => this.names.length)
      }
    }
    ```
    * Mitt全局事件总线(eventBus)：
      * cnpm install emitter
      * 发送事件：`emitter.emit(event, params)`
      * 监听：`emitter.on(event/*, callback)`
      * 关闭监听：`emitter.off(event, callback)`/`emmiter.all.clear()`

- `defineAsyncComponent`(异步加载组件)，参数如下：
  +  loader: () => import("./LoginPopup.vue"),
  +  loadingComponent: LoadingComponent, /* 在加载时显示 */
  +  errorComponent: ErrorComponent, /* 显示是否有错误 */
  +  delay: 1000, /* 在显示加载组件之前延迟毫秒 */
  +  timeout: 3000 /* 这个毫秒之后的超时 */

- `defineComponent`：用于TS，内部定义泛型，检查option选项是否正确

- Vue3新增组件：
  +  Suspense：具有两个插槽
    * default：默认展示
    * fallback：未加载好时的展示

- Vue3与Vue2对比：
  + Vue3移除了$children
  + Vue3的v-model可绑定多个值，具体用法为：`v-model:title="title"`，子组件：`this.$emit('update:title')`
  + 编写风格：
    - Vue3采用`compositionApi`：
      + setup函数：具有`props`和`context`两个参数，无法使用this，因为并没有修改this绑定
        - `props`：与vue2一致
        - `context`：是一个对象，内部包含三个属性
          * attrs：所有传入的非prop的属性
          * slots：父组件传过来的插槽
          * emit：需要发送事件时的emit
      + setup的数据如果需要响应式，则需要使用`reactiveApi`或`refApi`进行处理：
        - reactiveApi：使用该Api处理数据时，数据就会被Proxy劫持，在页面里有响应式效果，但只能传入一个对象或数组类型
        - RefApi：`const count = ref(100)`，此时返回了一个ref对象，值存储在counte.value里，但在template模板上经过了处理，可以省略value。如果定义了
        ```
        // 此时template取info.count不能被解包，因为不是ref对象
        const info = {
            count
        }
        // 外层对象是reactive对象，可以使用info.count，省略value
        const info = reactive({
            count
        })
        ```
      + readonlyApi：某些情况下不希望定义的值被修改
        * 代理ref对象：`const info = readonly(ref(xxx))`，取值为`info.value
        * 代理reactive：`const info = readonly(reactive({name: 'John'}))`，取值为`info.name`
      + 关于Reactive判断的一些Api
        *  isProxy：判断是否被代理
        *  isReactive：判断是否被reactive代理，外面是readonly也为true
        *  isReadonly：判断是否被readonly代理，外面是reactive也为true
        *  toRaw：取到原生未代理对象
        *  shallowReactive：浅层的响应式
        *  shallowReadonly：浅层只读
      + toRefs：解构时将解构的属性变为ref，从而实现响应式，`let { name } = toRefs(reactive({ name: 'John' }))`
      + toRef：`let name = toRef(reactive({ name: 'John' }), 'name')`
      + 关于Ref判断的一些Api：
        *  unref：`isRef(val) ? val.value : val;`的语法糖
        *  isRef：判断是否是一个ref对象
        *  shallowRef：创建一个浅层的ref对象
        *  triggerRef：手动触发和shallowRef相关联的副作用
      + customRef：自定义ref
      ```
      import { customRef } from 'vue';

      export default function(value, delay = 300) {
        let timer = null;
        return customRef((track, trigger) => {
          return {
            get() {
              track();
              return value;
            },
            set(newValue) {
              clearTimeout(timer);
              timer = setTimeout(() => {
                value = newValue
                trigger();
              }, delay);
            }
          }
        })
      }
      ```
      + computed：与vue2一致，但会写到setup内：`const fullName = computed(() => firstName.value + lastName.value)`

      + watchEffect：
        * 接受的参数：
          * 一个回调函数，会立即执行一次，默认监听内部使用的值
          * 一个对象，通过设置flush的值来影响是否立即执行
        * 停止监听：
        ```
        const stop = watchEffect(() => {
            console.log(name);
        });
        stop();  停止监听
        ```
        * 回调函数具有一个onInvalidate参数，用来清除副作用，调用时`onInvalidate`函数接受一个回调，用来写入代码逻辑
        * ​

      + watch：
        * 监听对象的具体值：`watch(() => info.name, () => {})`
        * 监听的是reactive对象：`watch(() => info, () => {})`，此时newValue和oldValue是相同的
        * 监听的是ref对象：`watch(name, () => {})`
        * 希望监听的是一个普通对象：`watch(() => ({...info}), () => {})`
        * 监听多个数据源：`watch([info, name], () => {})`
        * 深度监听：watch第三个参数为对象，与vue2一致

      + ref的引用：通过赋予一个变量`const title = ref(null)`，再将title绑定到dom上，之后会自动给dom赋值，**用TS时最好通过`InstanceType<typeof xxx>`** 来使用，先内部获取实例的类型，再通过类型获取实例(原组件只是一个普通对象)

      + 生命周期钩子函数：
        * beforeDestroy -> beformUnmount
        * destroy -> unmounted
        * 另外，在vue3里，不需要显式定义beforeCreate和created，只需写在`setup`函数内即可。

      + 组件通信：
        * provide/inject：提供给子组件时需要套上一层`readonly`，让数据流向为单向数据流
        * ​

      + 顶层编写：给`script`标签添加`setup`，此时不需要导出对象，直接在标签内部编写vue3代码即可。(实验特性，后面可能会有改动)
        * 接受props通过`defineProps`
        * 发送事件通过`defineEmit`
        * 组件不需要在`components`引入

    - Vue2采用`optionsApi`：如Methods、filters等选项。弊端是功能复杂时，代码逻辑会被分散到各个选项，后期难以维护。

- Vue自带组件
  - component：引入组件，通过赋予is的值绑定动态渲染组件
    1. is的值可以是全局注册或局部注册的component
    2. component组件切换时会销毁之前的组件，若需要保留则需要使用`keep-alive`组件
  - `keep-alive`：保留组件状态，有特殊的属性：
    * include：只有匹配到的名称才进行缓存(组件内的name属性)
    * exclude：匹配到的组件名称不进行缓存(组件内的name属性)
    * max：最多缓存多少个组件，优先销毁最近未被访问的组件
  - transition：
    1. 定义`name`属性，默认为`v`
    2. 若同时存在animation和transition两个属性，则可以通过`type`属性来决定动画的执行时间
    3. `mode`属性：定义两个元素切换时，先执行消失还是出现，默认是同时执行
    4. `appear`：初次进入时也执行动画效果
    5. 定义六个class的样式，样式会在插入前后和移除前后进行添加和删除
    6. vue2与vue3的类名定义：`xxx-enter(xxx-enter-from)`、`xxx-enter-to`、`xxx-leave-from`、`xxx-leave-to`、`xxx-enter-active`、`xxx-leave-active`
    7. 直接定义某个阶段的类名：`enter-active-class="xxxclass"`
  - transition-group：给列表添加动画效果，此时存在`{name}-move`的类，如赋值`transition: transform 1s ease`则可以给所有移动添加动画效果。(可利用自定义属性data-index在钩子函数拿到Index的值)
  - Teleport：某些情况希望组件挂载到`VueApp`之外的地方，而不是组件树，比如移动到Body。
    + to属性：指定将内容移动到目标元素，可使用选择器
    + disabled：是否禁用teleport的功能

- GSAP动画库：通过结合`transition`组件的钩子函数，使用动画。

- Vue内部对dom的转换过程：`template` -> `render函数` -> `vNode`(通过渲染器) -> `真实DOM`
  + render函数：render函数是一个选项，返回值应该是一个由h函数生成的`vNode`。vue2会自动传入h函数，vue3需要导入。可通过babel插件使用`jsx`语法代替h函数(vue3脚手架不需要安装插件)。
  + h函数的三个参数：
    * tag：HTML标签名、组件(对象)或异步组件(Function)
    * props：创建dom的属性、事件等
    * children：子组件，文本或vNode(同样用h函数创建)
  + vue2实现render：
  ```
  export default {
    data() {
        return {
            counter: 0
        }
    },
    render(h) {
        return h("div", {class: 'app'}, {
          h('h2', null, this.counter),
          h('button', {
              onClick: this.counter++
          }, '+1'),
          h('button', {
              onClick: this.counter--
          }, '-1')
        })
    }
  }
  ```
  + vue3实现render：
  ```
  import { ref, h } from 'vue';
  export default {
    setup() {
        const counter = ref(0);
        return () => {
            return h("div", {class: 'app'}, [
              h('h2', null, counter.value),
              h('button', {
                  onClick: counter.value++
              }, '+1'),
              h('button', {
                  onClick: counter.value--
              }, '-1')
            ])
        }
    }
    render(h) {
        return h("div", {class: 'app'}, [
          h('h2', null, this.counter),
          h('button', {
              onClick: this.counter++
          }, '+1'),
          h('button', {
              onClick: this.counter--
          }, '-1')
        ])
    }
  }
  //  插槽的使用
  // 父组件
  <script>
    import HelloWorld from './HelloWorld';
    import { h } from 'vue';
    export default {
        setup() {
          return () => {
            return h(
              'div',
              { class: 'app' },
              [
                'App本身的内容',
                h(HelloWorld, null, { 
                  default: props => h('span', null,      `默认插槽展示内容${props.name}`)
                })
              ]
            )
          }
        }
    }
  </script>
  // 子组件
  <script>
    import { h } from 'vue';
    export default {
      setup(props, { slots }) {
        return () => {

          
          return h('div', null, [
            h('h2', null, 'hello world!'),
            slots.default ? slots.default({ name: 'gzzz' }) : h('span',   null, '默认插槽的内容')
          ])
        }
      }
    }
  </script>
  // jsx传插槽
  // 父组件
  <script>
    import HelloWorld from './HelloWorld';
    export default {
        setup() {
          return () => {
            return (
              <div>
                app文件内容
                <HelloWorld>
                  { {
                    default: props => <div>{props.defaultVal}</div>,
                    title: props => <div>{props.titleVal}</div>
                  } }
                </HelloWorld>
              </div>
            )
          }
        }
    }
  </script>
  // 子组件
  <script>
    export default {
      setup(props, { slots }) {
        return () => {
          return (
            <div>
              hello world
              {slots.default ? slots.default({ defaultVal: 'dval' }) :   'default undefine'}
              {slots.title ? slots.title({ titleVal: 'tval' }) : 'title   undefine'}
            </div>
          )
        }
      }
    }
  </script>
  ```

- 自定义指令：某些情况下，需要对DOM元素进行底层操作，这个时候需要用到自定义指令
  + 指令声明周期：
    * created：绑定元素的attribute或事件监听器未被应用前
    * beforeMount：绑定到元素，但未挂载
    * mounted：挂载
    * beforeUpdate：组件更新前
    * updated：组件更新后
    * beforeUnmount：绑定元素被卸载前
    * Unmounted：指令与元素解除绑定且元素被卸载
  + 局部定义：通过directives选项配置
  ```
  <template>
    <div>
      <button v-has:create>创建</button>
      <button v-has:edit>编辑</button>
    </div>
  </template>

  <script>
    export default {
      directives: {
        has: {
          mounted(el, bindings, vNode) {
            let hiddenCount = 0;
            const { meta } = bindings.instance;
            const arg = typeof bindings.arg === 'string' ? [bindings.arg]    : bindings.arg;
            
            if (!arg || !meta) return;

            arg.forEach(item => {
              if (!meta[item] && meta[item] !== undefined) hiddenCount++;
            });

            if (arg.length === hiddenCount) {
              el.parentNode && el.parentNode.removeChild(el);
            }
            
          }
        }
      },
      setup() {
        const meta = {
          edit: false,
          create: true
        };

        return {
          meta
        }
      }
    }
  </script>
  ```
  + 全局定义：通过app的directive方法
  ```
  app.directive('has', {
    mounted(el, bindings, vNode) {
      let hiddenCount = 0;
      const { meta } = bindings.instance;
      const arg = typeof bindings.arg === 'string' ? [bindings.arg]    : bindings.arg;
            
    if (!arg || !meta) return;

    arg.forEach(item => {
        if (!meta[item] && meta[item] !== undefined) hiddenCount++;
    });
    
    if (arg.length === hiddenCount) {
      el.parentNode && el.parentNode.removeChild(el);
    }
            
  })
  ```

- 插件：
  + 对象写法：app.use会调用对象内部的`Install`方法
  + 函数写法：app.use会直接执行该函数

- nextTick：

- 跨组件插槽：

  - 通过template传入子组件，内部嵌入slot接受父组件

  - 代码实现：

    ```js
    <template v-for="item in exactPropSlots" #[item.slotName]="scope">
      <template v-if="item.slotName">
        <slot :name="item.slotName" :row="scope.row"></slot>
      </template>
    </template>
    ```

    ​