### 一、基础
- 因为有些 npm 包安装是需要编译的，那么导致 windows / mac /linux 上编译出的可执行文件是不同的，也就是无法通用，因此我们在提交代码到 git 上去的时候，一般都会在 .gitignore 里指定忽略 node_modules 目录和里面的文件

### 二、作用
- 模块打包。可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。

- 在前端的“上古时期”，手写一堆浏览器兼容代码一直是令前端工程师头皮发麻的事情，而在今天这个问题被大大的弱化了，通过webpack的Loader机制，不仅仅可以帮助我们对代码做polyfill，还可以编译转换诸如.less, .vue, .jsx这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。

- 能力扩展。通过webpack的Plugin机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

### 三、实战
- [学习文章](https://juejin.cn/post/7023242274876162084#heading-0)

- `loader`：webpack 默认支持处理 JS 与 JSON 文件，其他类型都处理不了，处理css等其他类型的文件时必须借助 Loader 来对不同类型的文件的进行处理。Loader 就是将 Webpack 不认识的内容转化为认识的内容。
- `plugin`：Plugin可以贯穿 Webpack 打包的生命周期，执行不同的任务
- 常见loader和plugin
  + loader：
    * css-loader  // 转换css文件
    * style-loader // 将处理好的 css 通过 style 标签的形式添加到页面上
    * postcss-loader // 浏览器兼容样式
    * sass-loader(需要安装node-sass)/less-loader
    * babel-loader：需要配置preset-env配置时通过  
    ```js
    options{
      presets:[
       [
         '@babel/preset-env',
         {}
        ]
      ]
    }
    ```
    * 编译.vue文件：vue-loader、@vue/compiler-sfc和VueLoaderPlugin(插件)
  + plugin：
    * html-webpack-plugin // html文件自动引入
    * clean-webpack-plugin // 打包清理之前的打包文件
    * cross-dev // 配置环境变量，使用不同配置
    * DefinePlugin // webpack自带插件，定义变量
- 不可同时使用es6和commonJS的模块化
- mode:设置mode，其他选项也会有默认的设置
  + `development`
  + `production`
- devtool:
  + `eval`
  + `source-map`
- watch:监听代码改变，重新执行编译打包
- babel:
  + 核心库:@babel/core
  + 命令行操作babel:@babel/cli
  + 其他插件:@babel/plugin-transform-arrow-functions
  + 预设:@babel/preset-env
  + 工作流程：编译 -> 转换 -> 生成
  + https://github.com/jamiebuilds/the-super-tiny-compiler（简化编译器）
  + ​
- asset-module-type：
  + asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
  + asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
  + asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能.
  + asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource
- devServer:搭建一个本地服务器(基于express框架)，打包完放到内存，而不输出到dist
  + contentBase：静态资源目录，推荐使用绝对路径(开发时使用，节省静态资源的复制时间)
  + 模块热替换(HMR)：在程序运行过程中，替换、添加和删除时无需更新整个页面，此时可通过module.hot.accept方法监听对应模块，通过socket建立连接监听改变
  + proxy：匹配接口`/api`到`localhost:8888`，同是不传递api
    ```js
    proxy: {
        "api": {
            target: "localhost:8888",
            pathRewrite: {
                "^api": ""
            }
        }
    }
    ```
  + secure：支持https访问
- resolve模块：导出入`vue`这类第三方包时，会在`node_modules`里面找。如果是文件，则直接打包；如果是文件夹(无后缀)：根据mainFiles配置的选项顺序查找，默认是Index，再根据extensions解析扩展名。
  + extensions：解析默认扩展名，如`./xxx`，默认引入xxx文件夹里的index.js文件
  + alias：别名，如`@/api`，会解析为`src/api`
- 分离环境：
  1. 提取公共配置
  2. 通过config分离dev和prod环境
  3. 通过`webpack-merge`插件合并webpack配置
  4. 运行时改为运行对应的config文件
- 首屏渲染空白优化：随着webpack打包的文件增加，app.js里的代码也越来越多(第三方代码在vendor.js内)，此时会造成初次渲染空白时间过久的问题。解决方法：
  1. 通过import()方法导入，此时返回的是一个promise，并且webpack进行打包时会对其进行分包。(懒加载：`import('/* webpackChunkName: "xxx-chunk" */', './utils').then(res => res.sum(20, 30))`)，同时，使用vue的defineAsyncComponent(异步加载)方法
     ```js
     import { defineAsyncComponent } from 'vue';
     const asyncCpn = defineAsyncComponent(() => import('./asyncCpn'));
     // 或者传入对象
       const asyncCpn = defineAsyncComponent({
        loader: () => import('./asyncCpn'),
        // 这里传入更多配置
        loadingComponent: Loading(占位组件，如loading组件),
       });
     ```

- `require.context`：通过获取上下文获取文件路径，接受三个参数`path`、`recurse`、`reg`，可以通过该函数动态导入文件。