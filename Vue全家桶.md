### Vue-Router
#### 路由的两种模式：
- hash模式：通过监听`hashChange`事件来实现
- history模式：通过`pushState/popState/replaceState`来实现
#### 自带组件(内部通过Vue.component(xxx)注册了组件)：
- router-view：指定当前路由放置组件的位置
  + 新增slot，接受props
  + 新增多种属性，具体参照官方文档
  + 结合动画和component展示：
  ```vue
  <router-view v-slot="props">
    <transtion name="gz">
     <component :is="props.Component" />
    </transtion>
  </router-view>
  ```
- router-link：
  + to：指定跳转的路由
  + replace：使用`router.replace`，而不是`router.push`
  + active-class：激活的a链接的class
  + exact-active-class：给激活的a链接添加额外的class(需要精准匹配，如存在children路由)
#### 补充
- 匹配不存在的页面：`path："/:patchMatch(.*)"`，括号里的为正则表达式
- vue3的setup内部需要通过导入：`import { userRouter } from 'vue-router'`拿到router对象(vue2的this.$route)
- vue3不推荐使用导航守卫内的`next`，直接return即可
- 使`用history`模式时，需要额外的配置：
  + 需要后端nginx配置重定向，找不到路径时返回`index.html`
  + webpack配置`historyApiFallback`，跳转到对应的前端路由

- 一些API：
  + 动态添加路由：
    * `router.addRoute(route)`，常见于后台管理系统动态配置权限
    * `router.addRoute(routeName, route)`,在某个路由下添加子路由
  + 删除路由：
    * 添加相同name的路由
    * 调用`router.removeRoute(name)`
    * 调用`const removeRoute = router.addRoute`的返回值，即`removeRoute()`
  + 检查路由是否存在：`router.has()`
  + 返回包含所有路由记录的数组：`router.getRoutes`

### Vuex
#### 数据流向
- vueComponent -> action -> mutation -> state
#### 补充
- 五大模块：`state`、`getter`、`mutation`、`action`和`modules`
- vue3的setup内部需要通过导入：`import { userStore } from
- mapStates：
  + mapState(['name'])
  + mapState({
      name: state => state.name
      })
- mapGetters/mapMutations：
  + mapGetter(['name'])
  + mapGetter({
      name: 'nameInfo'
        })
- mutation通常payload参数传对象
  + 若未开启`namespaced`，存在相同的mutation(全局和局部)，此时都会触发，单独提交给全局的时候，使用(fnName, payload, { root: true })
- actions参数：`context`，`payload`
- module：
  + `mapState`、`mapGetter`等可在第一个参数传`moduleName`，第二个为对象或数组
  + 使用`createNamespacedHelper`方法，
  ```js
  const { mapState, mapGetter, mapMutation, mapAction } = createNamespacedHelper('user'); // user是namespaced
  ```
- 封装
  + `mapStates`(mapGetters同理)，mapActions不需要封装
  ```js
  import { userStore, createNamespacedHelper } from 'vuex';
  import { computed } from 'vue';
  export function userState(mapper, moduleId) {
      const store = userStore();
      const stateFns = mapState(mapper);
      if (moduleId) stateFns = createNamespacedHelper('user').mapState;
      const state = {};
      Object.keys(stateFns).forEach(fnKey => {
        state[fnKey] = computed(stateFns[fnKey]).bind({
            $store: store
        })
      });
      return state;
  }
  ```